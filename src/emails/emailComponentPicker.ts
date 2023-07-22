// import other email components as needed

import { VercelInviteUserEmail } from "./vercel-invite-user";

// A function that takes the name of an email type and returns the corresponding React component
export const emailComponentPicker = (emailType: string) => {
  switch (emailType) {
    case "invite":
      return VercelInviteUserEmail;
    case "confirmation":
      return VercelInviteUserEmail;
    // other cases as needed...
    default:
      throw new Error("Invalid email type");
  }
};
