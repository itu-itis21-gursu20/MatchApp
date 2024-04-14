# MERN Stack with Socket.IO Application

Welcome to my MERN Stack application integrated with Socket.IO! This project is designed to showcase a real-time application that leverages the power of MongoDB, Express.js, React, and Node.js, along with the real-time bidirectional event-based communication capabilities of Socket.IO. The application is structured into four main directories: `api`, `client`, `socket`, each serving a unique purpose in the development of a scalable and efficient real-time web application.

## Features

- Real-time communication between clients and server
- Full CRUD operations through RESTful API
- Reactive user interface with React
- Scalable MongoDB database schema
- Custom real-time events with Socket.IO

## Project Structure

- `api/`: Contains Express server configurations, REST API endpoints, and middleware functions. This is where the backend logic of the application resides, handling requests and responses to and from the MongoDB database.

- `client/`: Houses the React frontend components. It's set up with Create React App and configured to communicate with the backend via HTTP requests and real-time sockets.

- `socket/`: Includes the setup and event handlers for Socket.IO, enabling real-time, bidirectional, event-based communication between the web clients and the server.

## Getting Started

To get the application running on your local machine, follow these steps:

1. Clone the repository to your local machine.
    ```
    git clone https://github.com/itu-itis21-gursu20/MatchApp.git
    ```

2. Install dependencies in both the `api/` and `client/` directories.
    ```
    cd api
    npm install

    cd ../client
    npm install
    ```

3. Start the backend server.
    ```
    cd api
    npm start
    ```

4. In a new terminal, start the React client.
    ```
    cd client
    npm start
    ```

5. Navigate to `http://localhost:8000` in your web browser to view the application.

## Environment Variables

Before starting the application, ensure you have the necessary environment variables set up. Create a `.env` file in the `api/` directory with the following variables:

- `MONGODB_URI`: Your MongoDB connection string
- `PORT`: The port number for the Express server (default: 8000)

## Contributing

Contributions are welcome! If you have suggestions for improvements or bug fixes, please feel free to fork the repository, make your changes, and submit a pull request.

I hope you find this MERN stack application with Socket.IO integration useful for your real-time application projects. Happy coding!
