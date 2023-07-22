import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Handler,
} from "aws-lambda";
import fetch from "node-fetch";
import { emailComponentPicker } from "./emails/emailComponentPicker";

const RESEND_API_KEY = process.env["RESEND_API_KEY"];

interface ResendResponse {
  id: string;
  message?: string;
}

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Missing query string parameters",
      }),
    };
  }

  // Instantiate the email component
  const emailType = event.queryStringParameters.emailType;
  if (!emailType) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Missing email type",
      }),
    };
  }

  const EmailComponent = emailComponentPicker(emailType);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: ["kaarthikandavar@gmail.com"],
        subject: "hello world",
        react: EmailComponent,
      }),
    });

    if (!res.ok) {
      throw new Error("API request failed");
    }

    const data = (await res.json()) as ResendResponse;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [[0, { id: data.id }]],
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Internal server error",
      }),
    };
  }
};
