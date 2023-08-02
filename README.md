# 📯 snowSend

<!-- <p align="center">
  <img src="" alt="snowSend Logo" width="200" />
</p> -->

Send Dynamic emails directly from Snowflake with **snowSend**. snowSend is an open-source prototype that empowers you to dispatch custom-styled emails directly from Snowflake. React to real-time triggers and provide a unique experience with emails stylized using React-Email components.

## ⚙️ Tech Stack

- **Snowflake** - API Integration, External Functions
- **AWS** - API Gateway, Lambda
- **Infrastructure as Code (IAC)** - Pulumi
- **Email** - Resend Labs

## ✨ Features

- **Custom Styled Emails**: Generate beautiful emails with the help of React-Email components and Tailwind CSS.
- **Real-time Triggers**: Deliver emails in response to real-time events from your Snowflake data warehouse.
- **Rapid Setup**: Get up and running in minutes. Complete infrastructure setup using Pulumi on both AWS & Snowflake.
- **Data Privacy**: Your data never leaves Snowflake, ensuring optimal privacy.
- **Integrated with Resend Labs**: Provides seamless integration with Resend Labs as an email service provider.

## ⨠ Installation

Follow these steps to get **snowSend** up and running in your environment.

1. **Clone the repository**

    ```bash
    git clone https://github.com/kaarthik108/snowSend.git
    ```

2. **Set up a Resend account**

    Sign up on Resend and retrieve the API Key:

    ```bash
    pulumi config set RESEND_API_KEY your_resend_api_key --secret
    ```

3. **Pulumi setup**

    - Navigate to the `pulumi` directory, edit `Pulumi.prod.yaml` add the config values, use the below command
    to set for all other configs

    ```bash
    pulumi config set snowflake:password your_password --secret
    ```

    - Install npm packages and check the email components:

    ```bash
    cd pulumi/app
    npm install
    npm run dev
    ```

    - Install packages and provision all resources needed in AWS and Snowflake:

    ```bash
    cd ..
    npm install
    pulumi up
    ```

    - Configure `API_AWS_EXTERNAL_ID` and `API_AWS_IAM_USER_ARN` values:

    ```bash
    pulumi config set API_AWS_EXTERNAL_ID $(pulumi stack output API_AWS_EXTERNAL_ID) --secret
    pulumi config set API_AWS_IAM_USER_ARN $(pulumi stack output API_AWS_IAM_USER_ARN) --secret
    pulumi up
    ```

4. **Deploy translator function** (manual step for now)

    This step is necessary due to an issue with snowflake when deploying the request translator UDF, as pulumi deploys functions with quotes eg: "snowsend-1234", but when you set that as REQUEST_TRANSLATOR in external function they don't register as quotes, which makes the external function to not able to find the UDF. So we do this step manually for now.

    ```bash
    cd ..
    pip install -r requirements.txt
    python test.py
    ```

Remember to replace the values in `test.py` with your function names (`EXTERNAL_FUNC` and `TRANSLATOR_UDF`).

## 🤝 Contributing

Your contributions are always welcome! Here's how:

- [Report a bug](https://github.com/kaarthik108/snowSend/issues) if you encounter one.
- Submit a [Pull Request](https://github.com/kaarthik108/snowSend/pulls) to help us improve the project.
