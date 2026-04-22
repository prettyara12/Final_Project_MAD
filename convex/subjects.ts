import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addSubject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    level: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("subjects", args);
  },
});

export const getPopularSubjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subjects").take(6);
  },
});

export const getSubjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subjects").collect();
  },
});
