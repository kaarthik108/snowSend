// import other email components as needed

import React from "react";
import { EmailTemplate } from "./test";

// A function that takes the name of an email type and returns the corresponding React component
export const emailComponentPicker = (emailType: string) => {
  switch (emailType) {
    case "invite":
      return (props: any) => <EmailTemplate {...props} />;
    case "confirmation":
      return EmailTemplate;
    // other cases as needed...
    default:
      throw new Error("Invalid email type");
  }
};
