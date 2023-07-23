// src/emails/testTemplate.tsx
import { Button } from '@react-email/button';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import * as React from 'react';

type TestTemplateProps = {
    /* Define the shape of the props here. For example: */
    title: string;
    link: string;
};

const TestTemplate: React.FC<TestTemplateProps> = ({ title, link }) => {
    return (
        <Html lang="en">
            <Text>{title}</Text>
            <Hr />
            <Button href={link}>Click me</Button>
        </Html>
    )
};

export default TestTemplate;
