import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
const router = express.Router();
router.use(authenticate);
router.get('/conversations', async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user.id
        }).populate('participants', 'username email avatar');
        const formatted = conversations.map((c) => ({
            id: c._id,
            name: c.name || (c.isGroup ? 'Group' : c.participants.find((p) => p._id.toString() !== req.user.id)?.username),
            isGroup: c.isGroup,
            participants: c.participants,
            lastMessage: c.lastMessage,
            lastMessageSenderId: c.lastMessageSenderId,
            lastMessageTime: c.lastMessageTime,
            unreadCount: 0 // Simplified
        }));
        res.json(formatted);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching conversations' });
    }
});
router.get('/messages/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params;
        if (!conversationId) {
            return res.status(400).json({ message: 'Conversation ID is required' });
        }
        const messages = await Message.find({
            conversationId
        }).sort({ timestamp: 1 });
        res.json(messages.map((m) => ({
            id: m._id,
            senderId: m.senderId,
            content: m.content,
            timestamp: m.timestamp,
            conversationId: m.conversationId
        })));
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
});
router.post('/groups', async (req, res) => {
    try {
        const { name, participants } = req.body;
        const conversation = new Conversation({
            name,
            isGroup: true,
            participants: [...participants, req.user.id]
        });
        await conversation.save();
        res.status(201).json({
            id: conversation._id,
            name: conversation.name,
            isGroup: conversation.isGroup,
            participants: conversation.participants,
            unreadCount: 0
        });
    }
    catch (err) {
        res.status(400).json({ message: 'Error creating group' });
    }
});
router.get('/users/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query)
            return res.json([]);
        const users = await User.find({
            _id: { $ne: req.user.id },
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('username email avatar').limit(10);
        res.json(users.map(u => ({
            id: u._id,
            username: u.username,
            email: u.email,
            avatar: u.avatar
        })));
    }
    catch (err) {
        res.status(500).json({ message: 'Error searching users' });
    }
});
export default router;
//# sourceMappingURL=chat.js.map