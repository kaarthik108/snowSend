import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
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
const baseUrl = process.env["URL"];

console.log('baseUrl', baseUrl);
export const SnowBrainEmail = ({
    username = 'people from earth',
}: SnowBrainEmailProps) => {
    const previewText = `Introducing SnowBrain: Transforming Data Interaction Through AI`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-gray-100 my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section className="text-center">
                            <Heading className="text-gray-900 text-2xl font-semibold mb-4">
                                Unleash the Power of <strong>SnowBrain</strong>
                            </Heading>
                            <Text className="text-gray-700 leading-relaxed">
                                Hi {username},
                            </Text>
                            <Text className="text-gray-700 leading-relaxed mt-4">
                                We are proud to introduce SnowBrain, your personal AI-powered data analyst. This state-of-the-art, open-source solution revolutionizes data interaction with unprecedented intuitiveness and efficiency.
                            </Text>
                            <Text className="text-gray-700 leading-relaxed mt-4">
                                Merging the capabilities of Snowflake, Langchain, OpenAI, Pinecone, NEXTjs, and FastAPI, SnowBrain offers a streamlined SQL querying experience. Regardless of your expertise level, SnowBrain enables you to explore, comprehend, and visualize your data like never before.
                            </Text>
                            <Section className="mt-8 mb-4">
                                <Button
                                    pX={6}
                                    pY={3}
                                    className="bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-semibold"
                                    href="https://snowbrain.dev"
                                >
                                    Experience snowBrain
                                </Button>
                            </Section>
                            <Section className="mt-8 mb-4">
                                <Img
                                    src={`${baseUrl}/snowbrain-logo.png`}
                                    alt="SnowBrain Logo"
                                    className="rounded-lg w-full max-w-md mx-auto"
                                />
                            </Section>
                            <Text className="text-gray-700 leading-relaxed mt-4">
                                As an open-source project, we invite you to explore our codebase, propose enhancements, or contribute to our development journey. Visit our GitHub repository here:
                                <Link
                                    href="https://github.com/kaarthik108/snowBrain"
                                    className="text-blue-600 underline"
                                >
                                    SnowBrain GitHub
                                </Link>
                            </Text>
                            <Hr className="border-gray-200 my-8" />
                            <Text className="text-gray-500 text-sm leading-relaxed">
                                If you were not the intended recipient of this email or if you have any inquiries or require assistance, feel free to respond to this email.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default SnowBrainEmail;
