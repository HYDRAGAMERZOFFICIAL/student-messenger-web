import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import Message from './models/Message.js';
import Conversation from './models/Conversation.js';
import { SOCKET_EVENTS } from './utils/socketEvents.js';
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.get('/', (req, res) => {
    res.send('Chat API is running');
});
// Socket.IO middleware for authentication
// Track online users
const onlineUsers = new Map(); // userId -> socketId
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        socket.user = decoded;
        next();
    }
    catch (err) {
        next(new Error('Authentication error'));
    }
});
io.on('connection', (socket) => {
    const user = socket.user;
    console.log('a user connected:', user.username);
    // Mark user as online
    onlineUsers.set(user.id, socket.id);
    socket.join(user.id);
    // Broadcast presence
    io.emit(SOCKET_EVENTS.USER_ONLINE, { userId: user.id });
    // Send list of currently online users to the new connection
    socket.emit(SOCKET_EVENTS.ONLINE_USERS, Array.from(onlineUsers.keys()));
    socket.on(SOCKET_EVENTS.TYPING_START, (data) => {
        const { targetId } = data; // Could be userId or groupId
        socket.to(targetId).emit(SOCKET_EVENTS.TYPING_START, { userId: user.id, username: user.username, targetId });
    });
    socket.on(SOCKET_EVENTS.TYPING_STOP, (data) => {
        const { targetId } = data;
        socket.to(targetId).emit(SOCKET_EVENTS.TYPING_STOP, { userId: user.id, targetId });
    });
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data) => {
        try {
            const { receiverId, groupId, content } = data;
            const targetId = groupId || receiverId;
            let conversation = await Conversation.findOne({
                $or: [
                    { _id: targetId },
                    { participants: { $all: [user.id, targetId] }, isGroup: false }
                ]
            });
            if (!conversation && !groupId) {
                conversation = new Conversation({
                    name: 'Private Chat',
                    participants: [user.id, targetId],
                    isGroup: false
                });
                await conversation.save();
            }
            if (conversation) {
                const message = new Message({
                    conversationId: conversation._id,
                    senderId: user.id,
                    content,
                    timestamp: new Date()
                });
                await message.save();
                await Conversation.findByIdAndUpdate(conversation._id, {
                    lastMessage: content,
                    lastMessageTime: new Date()
                });
                const messageData = {
                    id: message._id,
                    senderId: user.id,
                    senderName: user.username,
                    content,
                    timestamp: message.timestamp,
                    conversationId: conversation._id,
                    groupId: conversation.isGroup ? conversation._id : undefined,
                    receiverId: !conversation.isGroup ? targetId : undefined
                };
                if (conversation.isGroup) {
                    conversation.participants.forEach((pId) => {
                        io.to(pId.toString()).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, messageData);
                    });
                }
                else {
                    io.to(targetId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, messageData);
                    socket.emit(SOCKET_EVENTS.RECEIVE_MESSAGE, messageData); // Echo back to sender
                }
            }
        }
        catch (err) {
            console.error('Error sending message:', err);
        }
    });
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log('user disconnected:', user.username);
        onlineUsers.delete(user.id);
        io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId: user.id });
    });
});
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-messenger';
mongoose.connect(MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch(err => console.error('Could not connect to MongoDB', err));
//# sourceMappingURL=index.js.map