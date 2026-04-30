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
    const sessionId = await ctx.db.insert("sessions", {
      ...args,
      status: "pending",
    });
    
    // Create notification for Tutor
    const learner = await ctx.db.get(args.learnerId);
    await ctx.db.insert("notifications", {
      userId: args.tutorId,
      title: "notif_new_request_title",
      description: `notif_new_request_desc|name:${learner?.name || "Siswa"},subject:${args.subject},date:${args.date},time:${args.time}`,
      type: "booking",
      read: false,
      createdAt: Date.now(),
    });

    // Create notification for Learner
    const tutor = await ctx.db.get(args.tutorId);
    await ctx.db.insert("notifications", {
      userId: args.learnerId,
      title: "notif_booking_sent_title",
      description: `notif_booking_sent_desc|subject:${args.subject},date:${args.date},time:${args.time},name:${tutor?.name || ""}`,
      type: "booking",
      read: false,
      createdAt: Date.now(),
    });

    return sessionId;
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
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    await ctx.db.patch(args.sessionId, { status: "booked" });

    // Check if conversation already exists between these users
    const existingAsTutor = await ctx.db
      .query("conversations")
      .withIndex("by_participants", (q) => q.eq("tutorId", session.tutorId).eq("studentId", session.learnerId))
      .first();

    const existingAsStudent = await ctx.db
      .query("conversations")
      .withIndex("by_participants", (q) => q.eq("tutorId", session.learnerId).eq("studentId", session.tutorId))
      .first();

    let conversationId = existingAsTutor?._id || existingAsStudent?._id;

    if (!conversationId) {
      conversationId = await ctx.db.insert("conversations", {
        tutorId: session.tutorId,
        studentId: session.learnerId,
        createdAt: Date.now(),
      });
    }

    // Create notification for Learner
    const tutor = await ctx.db.get(session.tutorId);
    await ctx.db.insert("notifications", {
      userId: session.learnerId,
      title: "notif_session_confirmed_title",
      description: `notif_session_confirmed_desc|name:${tutor?.name || ""},subject:${session.subject},date:${session.date},time:${session.time}`,
      type: "booking",
      read: false,
      createdAt: Date.now(),
    });

    return conversationId;
  },
});

export const rejectRequest = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    await ctx.db.patch(args.sessionId, { status: "cancelled" });

    // Create notification for Learner
    const tutor = await ctx.db.get(session.tutorId);
    await ctx.db.insert("notifications", {
      userId: session.learnerId,
      title: "notif_session_rejected_title",
      description: `notif_session_rejected_desc|name:${tutor?.name || ""},subject:${session.subject},date:${session.date},time:${session.time}`,
      type: "system",
      read: false,
      createdAt: Date.now(),
    });
  },
});
