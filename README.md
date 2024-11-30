# next-chatbot-kit

`next-chatbot-kit` is a starter template for building chatbots using **Next.js 15** and **Bun.js**. This template provides a simple and flexible foundation for creating conversational AI applications with support for integrating third-party services, state management, and scalable chatbot components.

## Features

- **Next.js 15** - Built with the latest features of Next.js.
- **Bun.js** - Uses Bun as the JavaScript runtime for faster builds and executions.
- **Customizable UI** - Easy to modify the chatbot UI according to your design requirements.
- **State Management** - Efficient state management for chatbot responses.
- **API Integration** - Seamlessly integrates with AI models or any custom backend for generating responses.
- **TypeScript Support** - Fully typed with TypeScript to ensure better code quality and IntelliSense.
- **Responsive Design** - Works well on all screen sizes with a mobile-first approach.

## Pre-requisite

- Install Node.js LTS version and Bun.js

- **Windows Powershell**
  ```bash
  powershell -c "irm bun.sh/install.ps1 | iex"
  ```
- **Linux or MacOS**
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

## Installation

To get started with `next-chatbot-kit`, follow these steps:

1. Install deps and make a folder :

   ```bash
   npx create-next-chatbot-kit <projects-name>
   ```

2. change your directory:

   ```bash
   cd <projects-name>
   ```

3. Add a `.env` File

- You can create a `.env` file manually or by running the following command in your project directory:

  ```bash
  touch .env
  ```

- Next, add the following content to your `.env` file:

  ```env
  GROQ_API_KEY=YOUR_API_KEY_HERE
  ```

Replace `YOUR_API_KEY_HERE` with your actual GROQ API key, which you can obtain from the [GROQ Console](https://console.groq.com/keys).

4. Run the development server:

   ```bash
   bun dev
   ```

5. Open your browser and visit `http://localhost:3000` to see the chatbot in action.

## Usage

You can easily customize the template by editing the following:

- **Components**: Modify the `Chatbot` component to fit your desired UI and functionality.
- **API Routes**: Customize the backend logic in the `pages/api` folder to suit your needs, whether it’s an AI-powered bot or a rule-based chatbot.
- **State Management**: The state management is already set up using React context; you can extend it as required for your app.
