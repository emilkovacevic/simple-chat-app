# Simple Chat App

This is a simple chat application built with Express.js, Socket.io, and React. The app allows users to join a chat room, send messages, and receive real-time updates about user activities such as joining, leaving, and typing.

![CHAT APP Image](cover.PNG)

## Server (Express.js and Socket.io)

### Installation
- Run `npm install` to install dependencies.
- Set the environment variable `PORT` to specify the server port.

### Usage
- Run `npm run dev` to start the development server.
- Socket.io is configured to accept connections from `http://localhost:5173` in development. Update the `cors` configuration in the server file (`index.js`) for production use.

## Client (React)

### Installation
- Run `npm install` to install dependencies.

### Usage
- Open the `App.tsx` file and set the `SERVER_URL` variable to the server's URL.
- Run `npm run dev` to start the React app.

## Features
- Users receive a welcome message upon joining the chat.
- Real-time updates for user joining, leaving, and sending messages.
- Typing activity notifications.
- Responsive design with a simple chat interface.

Feel free to use as needed.
