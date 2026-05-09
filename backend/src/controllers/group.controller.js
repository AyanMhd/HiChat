import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Group from "../models/group.model.js";
import Message from "../models/message.model.js";

const serializeGroup = async (group, currentUserId) => {
  const lastMessage = await Message.findOne({ groupId: group._id }).sort({ createdAt: -1 }).limit(1);
  const source = typeof group.toObject === "function" ? group.toObject() : group;

  return {
    ...source,
    isGroup: true,
    fullName: source.name,
    profilePic: source.avatar || "/avatars/group.svg",
    memberCount: source.members?.length || 0,
    lastMessage: lastMessage
      ? {
          text: lastMessage.text,
          image: lastMessage.image,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.senderId,
        }
      : null,
    unreadKey: `group:${source._id}`,
    currentUserId,
  };
};

export const getGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({ members: userId })
      .populate("members", "fullName email profilePic gender")
      .sort({ updatedAt: -1 });

    const serialized = await Promise.all(groups.map((group) => serializeGroup(group, userId)));
    res.status(200).json(serialized);
  } catch (error) {
    console.log("Error in getGroups controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { name, memberIds = [] } = req.body;
    const creatorId = req.user._id.toString();

    if (!name?.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const uniqueMembers = [...new Set([creatorId, ...memberIds.map((id) => id.toString())])];

    if (uniqueMembers.length < 2) {
      return res.status(400).json({ message: "Choose at least one other member" });
    }

    const group = await Group.create({
      name: name.trim(),
      members: uniqueMembers,
      createdBy: creatorId,
    });

    const populatedGroup = await Group.findById(group._id).populate("members", "fullName email profilePic gender");
    const serialized = await serializeGroup(populatedGroup, req.user._id);

    uniqueMembers.forEach((memberId) => {
      const socketId = getReceiverSocketId(memberId);
      if (socketId) io.to(socketId).emit("groupCreated", serialized);
    });

    res.status(201).json(serialized);
  } catch (error) {
    console.log("Error in createGroup controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findOne({ _id: groupId, members: userId });
    if (!group) return res.status(404).json({ message: "Group not found" });

    const messages = await Message.find({ groupId }).sort({ createdAt: 1 });
    const messagesWithReplies = await Promise.all(
      messages.map(async (msg) => {
        const msgObj = msg.toObject();
        if (msg.replyTo) {
          const repliedMessage = await Message.findById(msg.replyTo);
          if (repliedMessage) {
            msgObj.replyToMessage = {
              _id: repliedMessage._id,
              text: repliedMessage.text,
              image: repliedMessage.image,
              senderId: repliedMessage.senderId,
            };
          }
        }
        return msgObj;
      })
    );

    res.status(200).json(messagesWithReplies);
  } catch (error) {
    console.log("Error in getGroupMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { text, image, replyTo } = req.body;
    const { id: groupId } = req.params;
    const senderId = req.user._id;

    const group = await Group.findOne({ _id: groupId, members: senderId });
    if (!group) return res.status(404).json({ message: "Group not found" });

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      groupId,
      text,
      image: imageUrl,
      replyTo: replyTo || null,
    });

    let populatedMessage = newMessage.toObject();
    if (replyTo) {
      const repliedMessage = await Message.findById(replyTo);
      if (repliedMessage) {
        populatedMessage.replyToMessage = {
          _id: repliedMessage._id,
          text: repliedMessage.text,
          image: repliedMessage.image,
          senderId: repliedMessage.senderId,
        };
      }
    }

    group.members.forEach((memberId) => {
      if (memberId.toString() === senderId.toString()) return;
      const socketId = getReceiverSocketId(memberId.toString());
      if (socketId) io.to(socketId).emit("newGroupMessage", populatedMessage);
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.log("Error in sendGroupMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
