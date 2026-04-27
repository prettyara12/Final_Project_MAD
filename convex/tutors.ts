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
    const user = tutor.userId ? await ctx.db.get(tutor.userId) : null;
    return { ...tutor, user };
  },
});

export const getTutorDetail = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    // 1. Cari berdasarkan Tutor ID
    // Gunakan query + filter agar lebih aman terhadap tipe data di TypeScript
    let tutor = null;
    try {
      tutor = await ctx.db
        .query("tutors")
        .filter((q) => q.eq(q.field("_id"), args.id as any))
        .first();
    } catch (e) {}

    // 2. Jika tidak ketemu, cari berdasarkan User ID
    if (!tutor) {
      try {
        tutor = await ctx.db
          .query("tutors")
          .withIndex("by_userId", (q) => q.eq("userId", args.id as any))
          .first();
      } catch (e) {}
    }

    if (!tutor) return null;

    // 3. Ambil data user terkait
    let user = null;
    if (tutor.userId) {
       user = await ctx.db.get(tutor.userId);
    }
    
    return {
      ...tutor,
      user: user ? {
        _id: user._id,
        name: user.name,
        profileImage: (user as any).profileImage,
      } : null
    };
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
      rating: 5.0,
    });
  },
});

export const getTutorByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tutors")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const updateTutorProfile = mutation({
  args: {
    id: v.id("tutors"),
    subjects: v.optional(v.array(v.string())),
    bio: v.optional(v.string()),
    availability: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const getRecommendedTutors = query({
  args: {
    subject: v.string(),
    preferredTime: v.string(),
    learningStyle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tutors = await ctx.db.query("tutors").collect();
    
    const scoredTutors = await Promise.all(
      tutors.map(async (tutor) => {
        let score = 0;
        
        // 1. Contextual Match (+60)
        const isSubjectMatch = tutor.subjects?.some(s => s.toLowerCase().includes(args.subject.toLowerCase()));
        const isSpecializationMatch = tutor.specialization?.toLowerCase().includes(args.subject.toLowerCase());
        const isBioMatch = tutor.bio?.toLowerCase().includes(args.subject.toLowerCase());
        
        if (isSubjectMatch) {
          score += 60;
        } else if (isSpecializationMatch || isBioMatch) {
          score += 40; // High score for contextual match
        }

        // 2. Availability Match (+20)
        if (tutor.availability) {
          try {
            const avail = JSON.parse(tutor.availability);
            const hasTime = avail.times?.includes(args.preferredTime);
            const hasDay = avail.days?.some((d: string) => d.toLowerCase().includes(args.preferredTime.toLowerCase()));
            
            if (hasTime || hasDay) {
              score += 20;
            }
          } catch (e) {}
        }

        // 3. Rating Score (+20 max)
        score += (tutor.rating || 0) * 4; // Rating 5.0 -> 20 points

        const user = tutor.userId ? await ctx.db.get(tutor.userId) : null;
        return { ...tutor, user, score };
      })
    );

    // Sort by score descending and return top results
    return scoredTutors
      .filter(t => t.user !== null) // Only tutors with valid user profiles
      .sort((a, b) => b.score - a.score);
  },
});

export const saveStudentPreference = mutation({
  args: {
    userId: v.id("users"),
    subject: v.string(),
    topic: v.optional(v.string()),
    learningStyle: v.string(),
    preferredTime: v.string(),
    difficulty: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("studentPreferences", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getTutorsByPreferences = query({
  args: {
    subject: v.string(),
    preferredTime: v.string(),
  },
  handler: async (ctx, args) => {
    const tutors = await ctx.db.query("tutors").collect();
    
    const scoredTutors = await Promise.all(
      tutors.map(async (tutor) => {
        let score = 0;
        
        // Subject match (60 points) - Higher priority
        if (tutor.subjects?.some(s => s.toLowerCase() === args.subject.toLowerCase())) {
          score += 60;
        }

        // Availability match (20 points)
        if (tutor.availability?.toLowerCase().includes(args.preferredTime.toLowerCase())) {
          score += 20;
        }

        // Rating match (up to 20 points)
        score += (tutor.rating || 0) * 4; // Rating 5.0 -> 20 points

        const user = tutor.userId ? await ctx.db.get(tutor.userId) : null;
        return { ...tutor, user, score };
      })
    );

    return scoredTutors
      .filter(t => t.user !== null)
      .sort((a, b) => b.score - a.score);
  },
});


