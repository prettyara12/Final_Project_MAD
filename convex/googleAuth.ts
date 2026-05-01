import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

// Called by the HTTP endpoint to store Google auth result
export const storeGoogleAuthResult = internalMutation({
  args: {
    sessionId: v.string(),
    name: v.string(),
    email: v.string(),
    picture: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("googleAuthSessions", {
      sessionId: args.sessionId,
      name: args.name,
      email: args.email,
      picture: args.picture,
    });
  },
});

// Called by the mobile app to check if Google auth completed
export const getGoogleAuthResult = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("googleAuthSessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .unique();
  },
});
