import { render } from "@react-email/render";
import TestTemplate from "emails/TestTemplate";
import SnowBrainEmail from "emails/snowbrain-template";
import StripeWelcomeEmail from "emails/stripe-welcome";
import React from "react";

interface EmailComponents {
    [key: string]: (props: any) => React.ReactNode;
}

const emailComponents: EmailComponents = {
    "test": TestTemplate,
    "stripe": StripeWelcomeEmail,
    "product": SnowBrainEmail
    // Add other email types and their corresponding components
};

interface EmailData {
    emailType: string;
    [key: string]: any;
}

export function renderEmail(emailData: EmailData) {
    const EmailComponent = emailComponents[emailData.emailType];
    return render(<EmailComponent {...emailData} />);
}