import { render } from "@react-email/render";
import StripeWelcomeEmail from "emails/stripe-welcome";
import TestTemplate from "emails/TestTemplate";
import React, { ReactElement } from "react";

interface EmailComponents {
    [key: string]: (props: any) => ReactElement;
}

const emailComponents: EmailComponents = {
    "test": TestTemplate,
    "stripe": StripeWelcomeEmail
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