import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import * as snowflake from "@pulumi/snowflake";

const config = new pulumi.Config();
const resendApiKey = config.get("RESEND_API_KEY");
const imageUrl = config.get("URL") || "";
const sf_iam_user_arn = config.get("API_AWS_IAM_USER_ARN") || "*";
const sf_external_id = config.get("API_AWS_EXTERNAL_ID") || "**";

const identity = pulumi.output(aws.getCallerIdentity({}));
const region = pulumi.output(aws.getRegion({}));
const accountId = identity.apply((id) => id.accountId);

const repo = new awsx.ecr.Repository("snow_repo", {
  forceDelete: true,
});
const image = new awsx.ecr.Image("snow_image", {
  repositoryUrl: repo.url,
  path: "./app",
});

const lambdaRole = new aws.iam.Role("snow_lambdaRole", {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal(aws.iam.Principals.LambdaPrincipal),
  managedPolicyArns: [aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole],
});

const lambdaS3AccessPolicy = new aws.iam.Policy("lambdaS3AccessPolicy", {
  path: "/",
  description: "Allows lambda function to access S3",
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: ["s3:GetObject"],
        Effect: "Allow",
        Resource: "arn:aws:s3:::snowsend/*",
      },
    ],
  }),
});

const lambdaRolePolicyAttachment = new aws.iam.RolePolicyAttachment("lambdaRolePolicyAttachment", {
  role: lambdaRole.name,
  policyArn: lambdaS3AccessPolicy.arn,
});

// /* [optional] create an s3 bucket */
// const bucket = new aws.s3.Bucket("snowsend", {
//   corsRules: [
//     {
//       allowedMethods: ["GET"],
//       allowedOrigins: ["*"],
//       allowedHeaders: ["*"],
//     },
//   ],
// });

// /* [optional] create a bucket policy */
// const bucketPolicy = new aws.s3.BucketPolicy("snow_bucketPolicy", {
//   bucket: bucket.id,
//   policy: bucket.arn.apply((arn) =>
//     JSON.stringify({
//       Version: "2012-10-17",
//       Statement: [
//         {
//           Effect: "Allow",
//           Principal: "*",
//           Action: ["s3:GetObject"],
//           Resource: [`${arn}/*`],
//         },
//       ],
//     })
//   ),
// });

const lambda = new aws.lambda.Function("snowsend", {
  imageUri: image.imageUri,
  role: lambdaRole.arn,
  timeout: 900,
  packageType: "Image",
  environment: {
    variables: {
      RESEND_API_KEY: resendApiKey!,
      URL: imageUrl!,
    },
  },
});

const apiGateway = new aws.apigateway.RestApi("snowsend");

const resource = new aws.apigateway.Resource("snow_resource", {
  parentId: apiGateway.rootResourceId,
  pathPart: "snow",
  restApi: apiGateway.id,
});

const method = new aws.apigateway.Method("snow_method", {
  httpMethod: "POST",
  authorization: "AWS_IAM",
  resourceId: resource.id,
  restApi: apiGateway.id,
});

const integration = new aws.apigateway.Integration("snow_integration", {
  httpMethod: method.httpMethod,
  resourceId: resource.id,
  restApi: apiGateway.id,
  type: "AWS_PROXY",
  integrationHttpMethod: "POST",
  uri: lambda.invokeArn,
});

const deployment = new aws.apigateway.Deployment(
  "deployment",
  {
    restApi: apiGateway.id,
  },
  { dependsOn: [integration] }
);

const stage = new aws.apigateway.Stage("snow_stage", {
  restApi: apiGateway.id,
  deployment: deployment.id,
  stageName: "dev",
});

const methodsettings = new aws.apigateway.MethodSettings("snow_methodsettings", {
  restApi: apiGateway.id,
  stageName: stage.stageName,
  methodPath: "*/*",
  settings: {
    loggingLevel: "INFO",
    metricsEnabled: true,
    throttlingBurstLimit: 5000,
    throttlingRateLimit: 10000,
  },
});

const sourceArn = pulumi
  .all([region, identity, apiGateway.id])
  .apply(
    ([region, identity, apiGatewayId]) =>
      `arn:aws:execute-api:${region.name}:${identity.accountId}:${apiGatewayId}/*/POST/*`
  );

const permission = new aws.lambda.Permission("snow_permission", {
  action: "lambda:InvokeFunction",
  function: lambda.name,
  principal: "apigateway.amazonaws.com",
  sourceArn: sourceArn,
});

/* Snowflake role */
const sf_role = new aws.iam.Role("sf_role", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          AWS: sf_iam_user_arn,
        },
        Action: "sts:AssumeRole",
        Condition: {
          StringEquals: {
            "sts:ExternalId": sf_external_id,
          },
        },
      },
    ],
  }),
  description: "A role that can be assumed by Snowflake",
  maxSessionDuration: 3600,
});

const apiIntegration = new snowflake.ApiIntegration("snowsend_api_gateway", {
  apiAllowedPrefixes: [pulumi.interpolate`${stage.invokeUrl}/${resource.pathPart}`],
  apiAwsRoleArn: sf_role.arn,
  apiProvider: "aws_api_gateway",
  enabled: true,
});

const policyDocument = aws.iam.getPolicyDocumentOutput({
  statements: [
    {
      effect: "Allow",
      principals: [
        {
          type: "AWS",
          identifiers: ["*"] /* Restrict to specific IAM users or roles */,
        },
      ],
      actions: ["execute-api:Invoke"],
      resources: [pulumi.interpolate`arn:aws:execute-api:${region.name}:${accountId}:${apiGateway.id}/*/POST/*`],
    },
  ],
});

const apiGatewayPolicy = new aws.apigateway.RestApiPolicy("apiGatewayPolicy", {
  restApiId: apiGateway.id,
  policy: policyDocument.apply((pd) => pd.json),
});

/* Bug: pulumi creates function with quotes but external function doesnt like quotes when used with "requestTranslator" */
// const functionResource = new snowflake.Function("_req_translator", {
//   database: "ANALYTICS",
//   schema: "PUBLIC",
//   returnType: "OBJECT",
//   language: "javascript",
//   statement: javascriptStatement,
//   arguments: [
//     {
//       name: "EVENT",
//       type: "OBJECT",
//     },
//   ],
//   name: `_req_translator`,
// });

const sf_func = new snowflake.ExternalFunction(
  "__snowsend",
  {
    apiIntegration: apiIntegration.name,
    args: [
      {
        name: "emailType",
        type: "string",
      },
      {
        name: "body",
        type: "variant",
      },
    ],
    returnBehavior: "VOLATILE",
    returnType: "variant",
    // requestTranslator: "javascript", /* Bug: pulumi creates function with quotes but external function doesnt like quotes when used with "requestTranslator" */
    urlOfProxyAndResource: pulumi.interpolate`${stage.invokeUrl}/${resource.pathPart}`,
    database: "ANALYTICS",
    schema: "PUBLIC",
  },
  {
    ignoreChanges: ["args", "returnBehavior", "returnType", "urlOfProxyAndResource"],
  }
);

export const API_AWS_EXTERNAL_ID = apiIntegration.apiAwsExternalId;
export const API_AWS_IAM_USER_ARN = apiIntegration.apiAwsIamUserArn;
