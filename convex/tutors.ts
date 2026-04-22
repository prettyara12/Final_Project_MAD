import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTutors = query({
  args: {},
  handler: async (ctx) => {
    const tutors = await ctx.db.query("tutors").collect();
    return Promise.all(
      tutors.map(async (tutor) => {
        // Cek jika userId ada sebelum mengambil data user
        const user = tutor.userId ? await ctx.db.get(tutor.userId) : null;
        return { ...tutor, user };
      })
    );
  },
});

export const getTutorById = query({
  args: { id: v.id("tutors") },
  handler: async (ctx, args) => {
    const tutor = await ctx.db.get(args.id);
    if (!tutor) return null;
    // Cek jika userId ada sebelum mengambil data user
    const user = tutor.userId ? await ctx.db.get(tutor.userId) : null;
    return { ...tutor, user };
  },
});

export const createTutorProfile = mutation({
  args: {
    userId: v.id("users"),
    subjects: v.array(v.string()),
    bio: v.string(),
    availability: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tutors", {
      userId: args.userId,
      subjects: args.subjects,
      bio: args.bio,
      availability: args.availability,
      rating: 5.0, // Default rating
    });
  },
});
