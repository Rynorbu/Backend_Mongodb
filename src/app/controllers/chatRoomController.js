
const ChatRoom = require('../models/chatRoomModel');

// Create or get chat room by members
exports.getOrCreateChatRoom = async (req, res) => {
    const { member1, member2 } = req.params;
    const room_id = `${member1}_${member2}`;

    try {
        let chatRoom = await ChatRoom.findOne({ room_id });

        if (!chatRoom) {
            chatRoom = new ChatRoom({
                room_id,
                members: [member1, member2],
                messages: []
            });
            await chatRoom.save();
        }

        res.json(chatRoom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add message to chat room
exports.addMessage = async (req, res) => {
    const { room_id } = req.params;
    const { from, to, media } = req.body;

    try {
        const chatRoom = await ChatRoom.findOne({ room_id });

        if (!chatRoom) {
            return res.status(404).json({ error: 'Chat room not found' });
        }

        const message = {
            from,
            to,
            media,
            timestamp: new Date()
        };

        chatRoom.messages.push(message);
        await chatRoom.save();

        res.json(chatRoom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get chat room messages
exports.getMessages = async (req, res) => {
    const { room_id } = req.params;

    try {
        const chatRoom = await ChatRoom.findOne({ room_id });

        if (!chatRoom) {
            return res.status(404).json({ error: 'Chat room not found' });
        }

        res.json(chatRoom.messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
