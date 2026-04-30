import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
  args: {
    senderId: v.string(), // Menggunakan string untuk fleksibilitas
    receiverId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      senderId: args.senderId,
      receiverId: args.receiverId,
      content: args.content,
      timestamp: Date.now(),
    });
  },
});

export const getMessages = query({
  args: { userA: v.string(), userB: v.string() },
  handler: async (ctx, args) => {
    const messages1 = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.userA).eq("receiverId", args.userB)
      )
      .collect();

    const messages2 = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.userB).eq("receiverId", args.userA)
      )
      .collect();

    return [...messages1, ...messages2].sort((a, b) => a.timestamp - b.timestamp);
  },
});

export const deleteConversation = mutation({
  args: { userA: v.string(), userB: v.string() },
  handler: async (ctx, args) => {
    const messages1 = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.userA).eq("receiverId", args.userB)
      )
      .collect();

    const messages2 = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.userB).eq("receiverId", args.userA)
      )
      .collect();

    const allMessages = [...messages1, ...messages2];
    for (const msg of allMessages) {
      await ctx.db.delete(msg._id);
    }
    
    return { success: true, count: allMessages.length };
  },
});

export const getAIChatSessions = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const AI_BOT_ID = "ai_system_bot";
    
    const messages1 = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.userId).eq("receiverId", AI_BOT_ID)
      )
      .collect();

    const messages2 = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", AI_BOT_ID).eq("receiverId", args.userId)
      )
      .collect();

    const allMessages = [...messages1, ...messages2].sort((a, b) => a.timestamp - b.timestamp);
    
    if (allMessages.length === 0) return [];

    const sessions = [];
    let currentSession: any = null;
    const SESSION_GAP = 30 * 60 * 1000; // 30 minutes gap

    for (const msg of allMessages) {
      if (!currentSession || (msg.timestamp - currentSession.lastTimestamp > SESSION_GAP)) {
        if (currentSession) {
          sessions.push(currentSession);
        }
        currentSession = {
          startTime: msg.timestamp,
          lastTimestamp: msg.timestamp,
          preview: msg.content.substring(0, 50),
          messageCount: 1,
        };
      } else {
        currentSession.lastTimestamp = msg.timestamp;
        currentSession.messageCount++;
      }
    }
    
    if (currentSession) {
      sessions.push(currentSession);
    }

    return sessions.reverse(); // Newest sessions first
  },
});

export const deleteMessagesInRange = mutation({
  args: { 
    userId: v.string(), 
    startTime: v.number(), 
    endTime: v.number() 
  },
  handler: async (ctx, args) => {
    const AI_BOT_ID = "ai_system_bot";
    
    const messages1 = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.userId).eq("receiverId", AI_BOT_ID)
      )
      .collect();

    const messages2 = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", AI_BOT_ID).eq("receiverId", args.userId)
      )
      .collect();

    const toDelete = [...messages1, ...messages2].filter(
      msg => msg.timestamp >= args.startTime && msg.timestamp <= args.endTime
    );

    for (const msg of toDelete) {
      await ctx.db.delete(msg._id);
    }

    return { success: true, deletedCount: toDelete.length };
  },
});
