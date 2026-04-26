import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("tutor"), v.literal("learner")),
    university: v.optional(v.string()),
    major: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      role: args.role,
      university: args.university,
      major: args.major,
    });
    return userId;
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    university: v.optional(v.string()),
    major: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    preferences: v.optional(
      v.object({
        learningStyle: v.optional(v.string()),
        availability: v.optional(v.string()),
      })
    ),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});
