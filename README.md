
# Microsoft Teams Clone
A multifunctional video calling app (Microsoft Teams Clone)

## Features

- Multiple rooms can be created with custom room IDs
- Multiple users can communicate at a same time in a room
- Users can chat before, during and after the meeting, with same chat accessible from inside and outside the meeting room
- Mute/Unmute the Audio
- Start/Stop the Video
- Ability to share the screen
- Record your screen
- Login and Register with session
- Responsive UI

## How to call other users?

Enter the same roomname in the homepage to connect with other users.

## Getting started

### Prerequisites

Install [node](https://nodejs.org/en/) in your system.

### Run locally

- Fork or clone the repository.
- Navigate to the repository.
    ```
    cd Microsoft-Teams-Clone
    ```
- For downloading the dependencies
    ```
    npm ci
    ```
- Install nodemon 
    ```
    npm install -g nodemon
    ```

- Run 
    ```
    nodemon server.js
    ```

- The app will run on `localhost:5000` or on the port specified in the environment variable 

## Tech stack used

- Backend - NodeJS & Express
- Frontend - Javascript and EJS

## How video call works?

It uses [PeerJS](https://peerjs.com/) an open source API that wraps WebRTC to create a peer-to-peer connection and helps to accomplish features like video call, share screen, record screen etc. WebRTC facilitates Real Time Communication (RTC) between browsers, mobile platforms and IOTs and allow then to communicate via common set of protocols.

## How web sockets work?

It uses [socket.io](https://socket.io/) an open source library that implements web sockets. Web socket provide a bidirectional communication between web clients and servers. It helps in passing the messages to other users when some user joins/leaves the meeting ,send message in the chat etc.

## Demo of the application

[Click Here](https://microsoft-teams-clone-nodejs.herokuapp.com/) to test out the application
