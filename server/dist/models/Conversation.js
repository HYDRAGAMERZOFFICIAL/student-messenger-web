import mongoose from 'mongoose';
const conversationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isGroup: { type: Boolean, default: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: String },
    lastMessageTime: { type: Date },
}, { timestamps: true });
export default mongoose.model('Conversation', conversationSchema);
//# sourceMappingURL=Conversation.js.map