import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createGroup, getGroupMessages, getGroups, sendGroupMessage } from "../controllers/group.controller.js";

const router = express.Router();

router.get("/", protectRoute, getGroups);
router.post("/", protectRoute, createGroup);
router.get("/:id/messages", protectRoute, getGroupMessages);
router.post("/:id/messages", protectRoute, sendGroupMessage);

export default router;
