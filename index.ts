import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Handler,
} from "aws-lambda";
import fetch from "node-fetch";
import { renderEmail } from "renderEmail";

const RESEND_API_KEY = process.env["RESEND_API_KEY"];

interface ResendResponse {
  id: string;
  message?: string;
}

interface EmailData {
  emailType: string;
  [key: string]: any; // This can contain title, link, or any other properties
}

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {
  if (!event.body) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Missing event body",
      }),
    };
  }

  const emailData: EmailData = JSON.parse(event.body);

  if (!emailData.emailType) {
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

  // Dynamically render the appropriate email based on the email type
  const html = renderEmail(emailData);

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
        subject: emailData.subject,
        html: html,
        text: "This is a test email",
      }),
    });

    if (!res.ok) {
      const errorDetails = await res.text();
      console.error(
        `API request failed with status ${res.status} and message: ${errorDetails}`
      );
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
