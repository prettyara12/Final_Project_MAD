import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  // Override the default users table to include app-specific fields
  users: defineTable({
    // Convex Auth standard fields
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // App-specific fields
    password: v.optional(v.string()),
    role: v.optional(v.union(v.literal("tutor"), v.literal("learner"))),
    university: v.optional(v.string()),
    major: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    year: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    language: v.optional(v.union(v.literal("id"), v.literal("en"), v.literal("zh"))),
    preferences: v.optional(
      v.object({
        learningStyle: v.optional(v.string()),
        availability: v.optional(v.string()),
      })
    ),
    stats: v.optional(
      v.object({
        completedSessions: v.number(),
        totalGoalSessions: v.number(),
        nextAchievement: v.string(),
        points: v.number(),
      })
    ),
  }).index("email", ["email"]),

  tutors: defineTable({
    userId: v.optional(v.id("users")),
    subjects: v.optional(v.array(v.string())),
    availability: v.optional(v.string()),
    bio: v.optional(v.string()),
    rating: v.number(),
    name: v.optional(v.string()),
    specialization: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isExpert: v.optional(v.boolean()),
    subjectId: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  subjects: defineTable({
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.string(),
    level: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
  }).index("by_name", ["name"]),

  sessions: defineTable({
    tutorId: v.id("users"),
    learnerId: v.id("users"),
    subject: v.string(),
    date: v.string(),
    time: v.string(),
    status: v.union(v.literal("pending"), v.literal("booked"), v.literal("completed"), v.literal("cancelled")),
  })
    .index("by_tutorId", ["tutorId"])
    .index("by_learnerId", ["learnerId"]),

  messages: defineTable({
    // Diubah menjadi v.string() agar mendukung bot "ai_system_bot"
    senderId: v.string(),
    receiverId: v.optional(v.string()), // Made optional to support new conversation logic
    conversationId: v.optional(v.id("conversations")), // Used for Tutor-Student chat
    content: v.string(),
    timestamp: v.number(),
  }).index("by_conversation", ["senderId", "receiverId"])
    .index("by_conversationId", ["conversationId"]),

  conversations: defineTable({
    tutorId: v.string(),
    studentId: v.string(),
    createdAt: v.number(),
  }).index("by_participants", ["tutorId", "studentId"]),

  studentPreferences: defineTable({
    userId: v.id("users"),
    subject: v.string(),
    topic: v.optional(v.string()),
    learningStyle: v.string(), // Visual, Theory, Practice
    preferredTime: v.string(), // morning, afternoon, evening
    difficulty: v.string(), // Beginner, Intermediate, Advanced
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    type: v.string(), // "booking", "message", "system"
    read: v.boolean(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
  
  groups: defineTable({
    title: v.string(),
    tutorId: v.id("users"),
    participants: v.number(),
    maxParticipants: v.number(),
    subject: v.string(),
    createdAt: v.number(),
  }).index("by_subject", ["subject"]),

  // Temporary table for Google OAuth mobile flow
  googleAuthSessions: defineTable({
    sessionId: v.string(),
    name: v.string(),
    email: v.string(),
    picture: v.optional(v.string()),
  }).index("by_sessionId", ["sessionId"]),
});
