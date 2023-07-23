// src/emails/testTemplate.tsx
import { Button } from '@react-email/button';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import * as React from 'react';

export type TestTemplateProps = {
    /* Define the shape of the props here. For example: */
    title: string;
    link: string;
};

export default function TestTemplate({ title, link }: TestTemplateProps) {
    return (
        <Html lang="en">
            <Text>{title}</Text>
            <Hr />
            <Button href={link}>Click me</Button>
        </Html>
    );
}
