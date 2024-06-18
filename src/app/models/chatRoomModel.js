const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    media: {
        type: {
            type: String,
            enum: ['text', 'image'],
            required: true
        },
        content: { type: String, required: true }
    },
    timestamp: { type: Date, default: Date.now }
});

const chatRoomSchema = new mongoose.Schema({
    room_id: { type: String, required: true, unique: true },
    members: [{ type: String, required: true }],
    messages: [messageSchema]
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
