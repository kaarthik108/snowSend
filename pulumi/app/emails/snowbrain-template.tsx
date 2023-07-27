import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface SnowBrainEmailProps {
    username?: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

export const SnowBrainEmail = ({
    username = 'User',
}: SnowBrainEmailProps) => {
    const previewText = `Discover SnowBrain - AI driven snowflake insights`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-gray-100 flex justify-center items-center h-screen font-sans">
                    <Container className="bg-white border border-gray-300 rounded-lg mx-auto p-8 w-full max-w-2xl">
                        <Section className="flex justify-center text-5xl font-bold mb-8">
                            <>&lt;&gt;</>
                        </Section>
                        <Section className="text-center">
                            <Heading className="text-gray-900 text-2xl font-semibold mb-4">
                                Welcome to <strong>SnowBrain</strong>
                            </Heading>
                            <Text className="text-gray-700 leading-relaxed">
                                Dear {username},
                            </Text>
                            <Text className="text-gray-700 leading-relaxed mt-4">
                                We are excited to introduce SnowBrain - an open-source prototype designed to be your personal data analyst. Powered by cutting-edge technology, SnowBrain provides a new way of interacting with your data.
                            </Text>
                            <Text className="text-gray-700 leading-relaxed mt-4">
                                By combining the strengths of Snowflake, Langchain, OpenAI, Pinecone, NEXTjs, and FastAPI, among others, SnowBrain reimagines the simplicity of SQL querying. Whether you're a data novice or an experienced analyst, SnowBrain can help you explore, understand, and visualize your data in an intuitive way.
                            </Text>
                            <Section className="mt-8 mb-4">
                                <Button
                                    pX={6}
                                    pY={3}
                                    className="bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-semibold"
                                    href="https://snowbrain.dev"
                                >
                                    Discover SnowBrain
                                </Button>
                            </Section>
                            <Section className="mt-8 mb-4">
                                <img
                                    src={`${baseUrl}/static/snowbrain-logo.png`}
                                    alt="SnowBrain screenshot"
                                    className="rounded-lg w-full max-w-md mx-auto"
                                />
                            </Section>
                            <Text className="text-gray-700 leading-relaxed mt-4">
                                SnowBrain is also an open-source project. We encourage you to explore our codebase, offer suggestions, or even contribute to its development. You can find our GitHub repository at the following link:
                                <Link
                                    href="https://github.com/kaarthik108/snowBrain"
                                    className="text-blue-600 underline"
                                >
                                    SnowBrain GitHub
                                </Link>
                            </Text>
                            <Hr className="border-gray-200 my-8" />
                            <Text className="text-gray-500 text-sm leading-relaxed">
                                This email was intended for{' '}
                                <span className="text-gray-900">{username}</span>. If you were not expecting this email, you can ignore it. However, if you have any questions or need further assistance, please don't hesitate to reply to this email.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default SnowBrainEmail;
