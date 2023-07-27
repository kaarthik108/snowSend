import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import * as snowflake from "@pulumi/snowflake";

let config = new pulumi.Config();
let apiAwsExternalId = config.get("apiAwsExternalId") || "default_external_id";
let apiAwsRoleArn = config.get("apiAwsRoleArn") || "default_role_arn";
let externalFuncId = config.get("externalFuncId");

const repo = new awsx.ecr.Repository("repo", {
  forceDelete: true,
});
const image = new awsx.ecr.Image("image", {
  repositoryUrl: repo.url,
  path: "./app",
});

const lambdaRole = new aws.iam.Role("lambdaRole", {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal(
    aws.iam.Principals.LambdaPrincipal
  ),
  managedPolicyArns: [aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole],
});

const lambda = new aws.lambda.Function("snowsend", {
  imageUri: image.imageUri,
  role: lambdaRole.arn,
  timeout: 900,
  packageType: "Image",
});

const apiGateway = new aws.apigateway.RestApi("api");

const method = new aws.apigateway.Method("method", {
  restApi: apiGateway.id,
  resourceId: apiGateway.rootResourceId,
  httpMethod: "POST",
  authorization: "AWS_IAM",
});

const integration = new aws.apigateway.Integration("integration", {
  restApi: apiGateway.id,
  resourceId: apiGateway.rootResourceId,
  httpMethod: method.httpMethod,
  integrationHttpMethod: "POST",
  type: "AWS_PROXY",
  uri: lambda.invokeArn,
});

const deployment = new aws.apigateway.Deployment(
  "deployment",
  {
    restApi: apiGateway.id,
  },
  { dependsOn: [integration] }
);

const stage = new aws.apigateway.Stage("stage", {
  restApi: apiGateway.id,
  deployment: deployment.id,
  stageName: "dev",
});

const identity = pulumi.output(aws.getCallerIdentity({}));
const region = pulumi.output(aws.getRegion({}));

const accountId = identity.apply((id) => id.accountId);
const regionName = region.apply((r) => r.name);

const sourceArn = pulumi
  .all([region, identity, apiGateway.id])
  .apply(
    ([region, identity, apiGatewayId]) =>
      `arn:aws:execute-api:${region.name}:${identity.accountId}:${apiGatewayId}/*/POST/*`
  );

const permission = new aws.lambda.Permission("permission", {
  action: "lambda:InvokeFunction",
  function: lambda.name,
  principal: "apigateway.amazonaws.com",
  sourceArn: sourceArn,
});

export const url = pulumi.interpolate`${stage.invokeUrl}`;

//snowflake
const sf_role = new aws.iam.Role("role", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Principal: {
          AWS: apiAwsRoleArn,
        },
        Effect: "Allow",
        Sid: "",
        Condition: {
          StringEquals: {
            "sts:ExternalId": apiAwsExternalId,
          },
        },
      },
    ],
  }),
  description: "A role that can be assumed by Snowflake",
  maxSessionDuration: 3600,
});

const methodArn = pulumi
  .all([apiGateway.id, stage.stageName, method.httpMethod, region, accountId])
  .apply(
    ([apiId, stageName, httpMethod, regionResult, accountIdResult]) =>
      `arn:aws:execute-api:${regionResult.name}:${accountIdResult}:${apiId}/*/${httpMethod}/`
  );

const sf_role_arn = pulumi.output(sf_role.arn).apply((arn) => arn);
const apiGateway_id = pulumi.output(apiGateway.id).apply((id) => id);

const policyDocument = pulumi
  .all([sf_role_arn, methodArn])
  .apply(([arn, methodArn]) => {
    const assumedRoleArn = `${arn}/snowflake`;
    return aws.iam
      .getPolicyDocument({
        statements: [
          {
            actions: ["execute-api:Invoke"],
            effect: "Allow",
            principals: [
              {
                type: "AWS",
                identifiers: [assumedRoleArn],
              },
            ],
            resources: [methodArn],
          },
        ],
      })
      .then((policy) => policy.json);
  });

const apiGatewayPolicy = new aws.apigateway.RestApiPolicy("apiGatewayPolicy", {
  restApiId: apiGateway_id,
  policy: pulumi
    .all([regionName, accountId, apiGateway_id, sf_role_arn])
    .apply(([regionName, accountId, apiId, assumedRoleArn]) =>
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              AWS: assumedRoleArn,
            },
            Action: "execute-api:Invoke",
            Resource: `arn:aws:execute-api:${regionName}:${accountId}:${apiId}/*/POST/*`,
          },
        ],
      })
    ),
});

const apiIntegration = new snowflake.ApiIntegration("snowsend_api_gateway", {
  apiAllowedPrefixes: [pulumi.interpolate`${stage.invokeUrl}`],
  apiAwsRoleArn: sf_role.arn,
  apiProvider: "aws_api_gateway",
  enabled: true,
});

let externalFunc;

try {
  externalFunc = pulumi.output(
    snowflake.ExternalFunction.get("snowsend", externalFuncId!)
  );
  console.log("Function exists, no need to update.");
} catch (error) {
  console.log("Function does not exist, creating new function.");
  externalFunc = new snowflake.ExternalFunction("snowsend", {
    apiIntegration: apiIntegration.name,
    args: [
      {
        name: "msg",
        type: "string",
      },
    ],
    returnBehavior: "VOLATILE",
    returnType: "variant",
    urlOfProxyAndResource: pulumi.interpolate`${stage.invokeUrl}`,
    database: "ANALYTICS",
    schema: "PUBLIC",
  });
}

export const actualApiAwsExternalId = apiIntegration.apiAwsExternalId;
export const actualApiAwsRoleArn = apiIntegration.apiAwsRoleArn;
export const createdExternalFuncID = externalFunc ? externalFunc.id : undefined;
