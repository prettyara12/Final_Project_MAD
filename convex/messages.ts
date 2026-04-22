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

