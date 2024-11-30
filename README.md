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

## Installation

To get started with `next-chatbot-kit`, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/araryarch/next-chatbot-kit.git
   ```

2. Navigate to the project folder:

   ```bash
   cd next-chatbot-kit
   ```

3. Install the dependencies using Bun or you can still use npm if u want:

   ```bash
   bun install
   ```

4. Run the development server:

   ```bash
   bun run dev
   ```

5. Open your browser and visit `http://localhost:3000` to see the chatbot in action.

## Usage

You can easily customize the template by editing the following:

- **Components**: Modify the `Chatbot` component to fit your desired UI and functionality.
- **API Routes**: Customize the backend logic in the `pages/api` folder to suit your needs, whether it’s an AI-powered bot or a rule-based chatbot.
- **State Management**: The state management is already set up using React context; you can extend it as required for your app.
