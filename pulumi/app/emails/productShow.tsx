import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface SnowChatEmailProps {
    username?: string;
    userImage?: string;
}

export const SnowChatEmail = ({
    username = 'Human',
}: SnowChatEmailProps) => {
    const previewText = `Introducing snowChat: Leveraging OpenAI's GPT for SQL queries`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src='../static/SNOW.png'
                                width="40"
                                height="37"
                                alt="snowChat"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Introducing <strong>snowChat</strong>
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {username},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            snowChat is a powerful and user-friendly application that enables users to interact with their Snowflake DataBase using natural language queries.
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Leveraging OpenAI's GPT model to convert natural language into SQL queries, snowChat makes it ideal for users who may not have a firm grasp of SQL syntax. It has a transformative impact on data interaction by expediting and streamlining data-driven decision-making.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                pX={20}
                                pY={12}
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center"
                                href="https://github.com/kaarthik108/snowChat"
                            >
                                View on GitHub
                            </Button>
                        </Section>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            If you have any questions or feedback, please reply to this email to get in touch with us.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default SnowChatEmail;
