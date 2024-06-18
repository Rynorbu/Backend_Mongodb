const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

const ChatRoom = require('./models/chatRoomModel');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.log(err);
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join room', async ({ room_id }) => {
        socket.join(room_id);
        const chatRoom = await ChatRoom.findOne({ room_id });
        if (chatRoom) {
            socket.emit('chat history', chatRoom.messages);
        }
    });

    socket.on('chat message', async ({ room_id, message }) => {
        const chatRoom = await ChatRoom.findOne({ room_id });
        if (chatRoom) {
            chatRoom.messages.push(message);
            await chatRoom.save();
        } else {
            const newChatRoom = new ChatRoom({
                room_id,
                members: [], 
                messages: [message]
            });
            await newChatRoom.save();
        }
        io.to(room_id).emit('chat message', message); 
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3001, () => {
    console.log('WebSocket server listening on port 3001');
});
