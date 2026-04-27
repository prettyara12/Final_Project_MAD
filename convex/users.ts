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

export const getLearningPulse = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // Hitung sesi yang selesai
    const completedSessions = await ctx.db
      .query("sessions")
      .withIndex("by_learnerId", (q) => q.eq("learnerId", args.userId))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    // Hitung total sesi (semua status)
    const allSessions = await ctx.db
      .query("sessions")
      .withIndex("by_learnerId", (q) => q.eq("learnerId", args.userId))
      .collect();

    // Target default mingguan (misal 5 sesi)
    const weeklyGoal = 5;
    
    // Logic pencapaian berdasarkan jumlah sesi selesai
    let nextAchievement = "Selesaikan sesi pertamamu!";
    const count = completedSessions.length;
    
    if (count === 0) nextAchievement = "Selesaikan 1 sesi untuk lencana 'Starter'";
    else if (count < 5) nextAchievement = `Selesaikan ${5 - count} sesi lagi untuk lencana 'Pengejar Ilmu'`;
    else if (count < 10) nextAchievement = `Selesaikan ${10 - count} sesi lagi untuk lencana 'Master Pelajar'`;
    else nextAchievement = "Kamu adalah Pelajar Legendaris!";

    return {
      completed: count,
      total: Math.max(allSessions.length, weeklyGoal),
      nextAchievement,
    };
  },
});
