import { render } from "@react-email/render";
import AppleReceiptEmail from "emails/InvoiceTemplate";
import TestTemplate from "emails/TestTemplate";
import PlaidVerifyIdentityEmail from "emails/plaidVerifyIdentity";
import SnowChatEmail from "emails/productShow";
import SnowBrainEmail from "emails/snowbrainTemplate";
import StripeWelcomeEmail from "emails/stripeWelcome";
import React from "react";

interface EmailComponents {
    [key: string]: (props: any) => React.ReactNode;
}

const emailComponents: EmailComponents = {
    "test": TestTemplate,
    "stripe": StripeWelcomeEmail,
    "snowbrain": SnowBrainEmail,
    "verify": PlaidVerifyIdentityEmail,
    "invoice": AppleReceiptEmail,
    "product": SnowChatEmail,
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