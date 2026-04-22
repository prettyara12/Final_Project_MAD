import { mutation } from "./_generated/server";

export const seedTutors = mutation({
  args: {},
  handler: async (ctx) => {
    const tutors = [
      {
        name: "Dr. Sarah Jenkins",
        specialization: "Kalkulus Lanjut & Fisika",
        subjects: ["Matematika", "Fisika"],
        rating: 4.9,
        bio: "Pakar matematika dengan pengalaman mengajar 10 tahun di universitas top.",
        availability: "Senin - Jumat",
        isExpert: true,
      },
      {
        name: "James Wilson",
        specialization: "Python & Data Science",
        subjects: ["Koding", "Data Science"],
        rating: 4.8,
        bio: "Senior Developer yang fokus pada pengembangan AI dan analisis data menggunakan Python.",
        availability: "Sore Hari",
        isExpert: true,
      },
      {
        name: "Maria Garcia",
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
