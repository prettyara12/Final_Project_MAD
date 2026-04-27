import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const seedTutors = mutation({
  args: {},
  handler: async (ctx) => {
    const tutors = [
      {
        name: "Adrielyanto Walintukan",
        specialization: "Matematika, Calculus, Fisika",
        subjects: ["Matematika", "Calculus", "Fisika"],
        rating: 5.0,
        bio: "Pakar matematika dengan pengalaman mengajar 8 tahun yang berfokus pada penyelesaian masalah kompleks.",
        availability: "Senin - Jumat",
        isExpert: true,
      },
      {
        name: "Mark Robinson",
        specialization: "Python & Data Science",
        subjects: ["Koding", "Data Science"],
        rating: 4.8,
        bio: "Senior Developer yang fokus pada pengembangan AI dan analisis data menggunakan Python.",
        availability: "Sore Hari",
        isExpert: true,
      },
      {
        name: "Sarah Jenkins",
        specialization: "UI/UX Design & Figma",
        subjects: ["Desain", "Seni"],
        rating: 4.7,
        bio: "Desainer produk senior yang telah membantu banyak startup membangun aplikasi yang cantik.",
        availability: "Fleksibel",
        isExpert: false,
      },
      {
        name: "Prof. Ananda",
        specialization: "Sastra & Bahasa Spanyol",
        subjects: ["Bahasa", "Sastra"],
        rating: 4.9,
        bio: "Ahli linguistik yang bersemangat membantu mahasiswa menguasai bahasa baru dengan cepat.",
        availability: "Pagi Hari",
        isExpert: true,
      },
      {
        name: "Dr. Mega Putri",
        specialization: "Biologi Molekuler",
        subjects: ["Biologi", "Kimia"],
        rating: 4.6,
        bio: "Peneliti biologi yang berfokus pada genetika dan struktur sel molekuler.",
        availability: "Akhir Pekan",
        isExpert: true,
      },
      {
        name: "Rina Sari",
        specialization: "Ekonomi Makro",
        subjects: ["Ekonomi", "Akuntansi"],
        rating: 4.5,
        bio: "Konsultan finansial yang senang berbagi ilmu tentang mekanisme pasar dan ekonomi global.",
        availability: "Senin - Rabu",
        isExpert: false,
      },
      {
        name: "Kevin Pratama",
        specialization: "JavaScript & React Native",
        subjects: ["Koding", "Mobile Dev"],
        rating: 4.8,
        bio: "Fullstack Developer dengan spesialisasi pengembangan aplikasi mobile lintas platform.",
        availability: "Malam Hari",
        isExpert: false,
      }
    ];

    for (const tutor of tutors) {
      await ctx.db.insert("tutors", tutor);
    }
    
    return "7 Tutor berhasil ditambahkan!";
  },
});

export const seedSubjects = mutation({
  args: {},
  handler: async (ctx) => {
    const subjects = [
      { name: "Matematika", title: "Kalkulus & Aljabar", description: "Pelajari angka dan logika", icon: "calculator", color: "#6C63FF" },
      { name: "Koding", title: "Web & Mobile Dev", description: "Membangun masa depan digital", icon: "code-slash", color: "#4CAF50" },
      { name: "Desain", title: "UI/UX & Grafis", description: "Visualisasikan ide kreatifmu", icon: "color-palette", color: "#FF4081" },
      { name: "Bahasa", title: "English & Mandarin", description: "Hubungkan dunia lewat kata", icon: "language", color: "#FF9800" },
      { name: "Sains", title: "Fisika & Kimia", description: "Ungkap rahasia alam semesta", icon: "flask", color: "#00BCD4" },
      { name: "Ekonomi", title: "Bisnis & Akuntansi", description: "Pahami alur keuangan dunia", icon: "trending-up", color: "#795548" },
    ];

    for (const sub of subjects) {
      await ctx.db.insert("subjects", sub);
    }
    
    return "6 Mata Pelajaran berhasil ditambahkan!";
  },
});

export const seedNotifications = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const notifications = [
      {
        userId: args.userId,
        title: "Sesi Berhasil Dipesan",
        description: "Sesi Matematika dengan Dr. Sarah Jenkins telah berhasil dijadwalkan.",
        type: "booking",
        read: false,
        createdAt: Date.now() - 1000 * 60 * 30, // 30 mins ago
      },
      {
        userId: args.userId,
        title: "Pencapaian Baru!",
        description: "Selamat! Kamu mendapatkan lencana 'Pemikir Dalam' karena menyelesaikan sesi 2 jam.",
        type: "achievement",
        read: false,
        createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
      },
      {
        userId: args.userId,
        title: "Pengingat Sesi",
        description: "Sesi Koding kamu akan dimulai dalam 1 jam. Siapkan pertanyaanmu!",
        type: "reminder",
        read: true,
        createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
      },
      {
        userId: args.userId,
        title: "Selamat Datang!",
        description: "Terima kasih telah bergabung dengan EduPartner AI. Mari mulai belajar!",
        type: "system",
        read: true,
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      }
    ];

    for (const notif of notifications) {
      await ctx.db.insert("notifications", notif);
    }
    
    return "4 Notifikasi berhasil ditambahkan!";
  },
});

export const seedGroups = mutation({
  args: {},
  handler: async (ctx) => {
    // Find some tutors
    const mark = await ctx.db.query("users").filter(q => q.eq(q.field("name"), "Mark Robinson")).first();
    const adriel = await ctx.db.query("users").filter(q => q.eq(q.field("name"), "Adrielyanto Walintukan")).first();
    const sarah = await ctx.db.query("users").filter(q => q.eq(q.field("name"), "Sarah Jenkins")).first();

    const groups = [
      {
        title: "Python untuk Data Analysis",
        tutorId: mark?._id || (await ctx.db.query("users").first())?._id,
        participants: 12,
        maxParticipants: 20,
        subject: "Koding",
        createdAt: Date.now(),
      },
      {
        title: "Dasar-dasar UI/UX",
        tutorId: sarah?._id || (await ctx.db.query("users").first())?._id,
        participants: 8,
        maxParticipants: 15,
        subject: "Desain",
        createdAt: Date.now(),
      },
      {
        title: "Kalkulus Lanjut",
        tutorId: adriel?._id || (await ctx.db.query("users").first())?._id,
        participants: 15,
        maxParticipants: 25,
        subject: "Matematika",
        createdAt: Date.now(),
      }
    ];

    for (const group of groups) {
      if (group.tutorId) {
        await ctx.db.insert("groups", group as any);
      }
    }
    
    return "3 Grup berhasil ditambahkan!";
  },
});
