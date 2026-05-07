import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

//Get all threads
router.get("/thread", async(req, res) => {
    try {
        const threads = await Thread.find({ userId: req.user.userId }).sort({updatedAt: -1});
        //descending order of updatedAt...most recent data on top
        res.json(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;

    try {
        const thread = await Thread.findOne({threadId, userId: req.user.userId});

        if(!thread) {
            return res.status(404).json({error: "Thread not found"});
        }

        res.json(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({threadId, userId: req.user.userId});

        if(!deletedThread) {
            return res.status(404).json({error: "Thread not found"});
        }

        res.status(200).json({success : "Thread deleted successfully"});

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

router.post("/chat", async(req, res) => {
    const {threadId, message} = req.body;

    if(!threadId || !message) {
        return res.status(400).json({error: "missing required fields"});
    }

    try {
        let thread = await Thread.findOne({threadId, userId: req.user.userId});

        if(!thread) {
            //create a new thread in Db
            thread = new Thread({
                userId: req.user.userId,
                threadId,
                title: message,
                messages: [{role: "user", content: message}]
            });
        } else {
            thread.messages.push({role: "user", content: message});
        }

        let assistantReply = "";
        let usedFallback = false;
        try {
            assistantReply = await getOpenAIAPIResponse(message);
        } catch (err) {
            const msg = err?.message || "AI service error";
            const shouldFallback =
                msg.toLowerCase().includes("quota") ||
                msg.toLowerCase().includes("billing") ||
                msg.toLowerCase().includes("rate limit") ||
                msg.toLowerCase().includes("429");

            if (shouldFallback) {
                usedFallback = true;
                assistantReply = "OpenAI quota is unavailable right now. This is a local fallback reply. Please recharge billing to restore live AI responses.";
            } else {
                assistantReply = `Error: ${msg}`;
            }
        }

        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();
        await thread.save();

        if (assistantReply.startsWith("Error:")) {
            return res.status(502).json({ error: assistantReply.replace("Error: ", "") });
        }

        return res.json({ reply: assistantReply, fallback: usedFallback });
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: err.message || "something went wrong"});
    }
});




export default router;
