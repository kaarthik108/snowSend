import { render } from "@react-email/render";
import React from "react";
import TestTemplate from "./src/emails/TestTemplate";

export function renderEmail(title: string, link: string) {
    return render(<TestTemplate title={title} link={link} />);
}
