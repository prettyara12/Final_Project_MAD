import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const bookSession = mutation({
  args: {
    tutorId: v.id("users"),
    learnerId: v.id("users"),
    subject: v.string(),
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", {
      ...args,
      status: "booked",
    });
  },
});

export const getSessionsByUser = query({
  args: { userId: v.id("users"), role: v.union(v.literal("tutor"), v.literal("learner")) },
  handler: async (ctx, args) => {
    let sessions;
    if (args.role === "tutor") {
      sessions = await ctx.db
        .query("sessions")
        .withIndex("by_tutorId", (q) => q.eq("tutorId", args.userId))
        .collect();
    } else {
      sessions = await ctx.db
        .query("sessions")
        .withIndex("by_learnerId", (q) => q.eq("learnerId", args.userId))
        .collect();
    }

    return Promise.all(
      sessions.map(async (session) => {
        const tutor = await ctx.db.get(session.tutorId);
        const learner = await ctx.db.get(session.learnerId);
        return { ...session, tutor, learner };
      })
    );
  },
});

export const updateSessionStatus = mutation({
  args: {
    id: v.id("sessions"),
    status: v.union(v.literal("pending"), v.literal("booked"), v.literal("completed"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// TUTOR DASHBOARD QUERIES & MUTATIONS

export const getStudentRequests = query({
  args: { tutorId: v.id("users") },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query("sessions")
      .withIndex("by_tutorId", (q) => q.eq("tutorId", args.tutorId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    return Promise.all(
      requests.map(async (request) => {
        const learner = await ctx.db.get(request.learnerId);
        return { ...request, learner };
      })
    );
  },
});

export const getTutorSessions = query({
  args: { tutorId: v.id("users") },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_tutorId", (q) => q.eq("tutorId", args.tutorId))
      .filter((q) => q.neq(q.field("status"), "pending")) // Fetch booked, completed, etc.
      .collect();

    return Promise.all(
      sessions.map(async (session) => {
        const learner = await ctx.db.get(session.learnerId);
        return { ...session, learner };
      })
    );
  },
});

export const acceptRequest = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, { status: "booked" });
  },
});

export const rejectRequest = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, { status: "cancelled" });
  },
});
