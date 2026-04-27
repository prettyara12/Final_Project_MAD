import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getRecommendedGroups = query({
  args: {},
  handler: async (ctx) => {
    const groups = await ctx.db.query("groups").order("desc").take(5);
    
    return Promise.all(
      groups.map(async (group) => {
        const tutor = await ctx.db.get(group.tutorId);
        return {
          ...group,
          tutorName: tutor?.name || "Tutor",
        };
      })
    );
  },
});

export const createGroup = mutation({
  args: {
    title: v.string(),
    tutorId: v.id("users"),
    maxParticipants: v.number(),
    subject: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("groups", {
      ...args,
      participants: 1,
      createdAt: Date.now(),
    });
  },
});
