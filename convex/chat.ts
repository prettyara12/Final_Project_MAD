import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .collect();
      
    return messages.sort((a, b) => a.timestamp - b.timestamp);
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      content: args.content,
      timestamp: Date.now(),
    });
  },
});

export const getConversations = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Fetch conversations where user is tutor
    const asTutor = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("tutorId"), args.userId))
      .collect();

    // Fetch conversations where user is student
    const asStudent = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("studentId"), args.userId))
      .collect();

    const allConversations = [...asTutor, ...asStudent];
    
    // Sort by createdAt descending
    allConversations.sort((a, b) => b.createdAt - a.createdAt);

    // Enhance with peer details and latest message
    return Promise.all(
      allConversations.map(async (conv) => {
        const isTutor = conv.tutorId === args.userId;
        const peerId = isTutor ? conv.studentId : conv.tutorId;
        const peerIdCast = peerId as Id<"users">;
        const peer = await ctx.db.get(peerIdCast); 
        
        // Fetch latest message
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) => q.eq("conversationId", conv._id))
          .order("desc")
          .take(1);
          
        return {
          ...conv,
          peerName: peer?.name || "Unknown User",
          peerRole: isTutor ? "Pelajar" : "Tutor",
          latestMessage: messages.length > 0 ? messages[0].content : "Mulai mengobrol...",
        };
      })
    );
  },
});
