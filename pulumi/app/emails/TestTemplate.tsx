import {
    Body,
    Button,
    Container,
    Html,
    Img,
    Tailwind,
    Text
} from '@react-email/components';
import * as React from 'react';

interface TestTemplateProps {
    title: string;
    link: string;
    name: string;
    imageLink: string;
    description: string;
};

const baseUrl = process.env["URL"];


const TestTemplate: React.FC<TestTemplateProps> = ({
    title = 'Hello',
    name,
    link = 'https://example.com',
    imageLink = `${baseUrl}/plaid-logo.png`,
    description = 'This is a sample email template.'
}) => {
    return (
        <Html lang="en">
            <Tailwind>
                <Body className="bg-gray-100 font-sans flex items-center justify-center h-screen">
                    <Container className="border border-gray-200 rounded-lg p-8 bg-white text-center shadow-lg max-w-md mx-auto">
                        <Img className="rounded-full mx-auto mb-4 w-24 h-24 object-cover" src={imageLink} alt="Sample Image" />
                        <Text className="text-black text-2xl font-semibold mb-2">{title}{name}</Text>
                        <Text className="text-gray-500 mb-4">{description}</Text>
                        <hr className="border-t border-gray-300 my-4" />
                        <Button href={link} className="inline-block bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded">
                            Click me
                        </Button>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
};

export default TestTemplate;
