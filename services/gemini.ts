import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `
You are EduPartner AI, a friendly and highly intelligent academic mentor. 
Your goal is to help students learn effectively, solve academic problems, and provide guidance on various subjects.

Tone and Personality:
- Encouraging, patient, and professional.
- Use clear and easy-to-understand language.
- Occasionally use emojis to keep the conversation engaging.
- Be proactive in suggesting learning strategies.

Scope of Knowledge:
- Mathematics, Physics, Biology, Chemistry.
- Programming (Python, JavaScript, TypeScript, React Native, etc.).
- Languages (English, Indonesian, etc.).
- General study tips and time management.

Constraint:
- Always identify yourself as EduPartner AI.
- DO NOT use markdown bolding (double asterisks like **text**) in your responses. Use plain text instead.
- If a question is completely unrelated to education or academic topics, gently steer the conversation back to learning or offer help with related academic aspects.
- Keep responses concise but informative.
`;

export async function getGeminiResponse(userMessage: string, history: { role: "user" | "model"; parts: { text: string }[] }[] = []) {
  if (!API_KEY) {
    console.error("Gemini API Key is missing! Check your .env.local file.");
    return "Konfigurasi AI belum lengkap. Silakan hubungi admin.";
  }

  try {
    // Gunakan model yang stabil: gemini-1.5-flash-latest
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
      systemInstruction: SYSTEM_PROMPT
    });

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error details:", error);

    // Deteksi error limit (quota/token) atau overload (high demand)
    const errorMessage = error?.message || "";
    const isTemporaryLimit =
      errorMessage.includes("429") ||
      errorMessage.includes("Quota exceeded") ||
      errorMessage.includes("rate limit") ||
      errorMessage.includes("high demand") ||
      errorMessage.includes("temporary") ||
      error?.status === 429 ||
      error?.response?.status === 429;

    if (isTemporaryLimit) {
      return "Maaf, Gemini AI sedang sangat sibuk atau kuota sudah limit. Silakan tunggu sekitar 10 detik atau beberapa saat lagi sebelum mencoba kembali. 🙏";
    }

    return "Maaf, saya sedang mengalami kendala teknis. Bisa ulangi lagi nanti?";
  }
}

export async function getTutorRecommendation(studentNeeds: {
  subject: string;
  difficulty?: string;
  learningStyle?: string;
  preferredTime: string;
  notes?: string;
}, tutors: any[]) {
  if (!API_KEY) return null;

  const prompt = `
Recommend the best tutors based on the following student needs and available tutor data. 

CRITICAL RULES:
1. PRIMARY MATCH: The tutor MUST teach "${studentNeeds.subject}". 
2. EXCLUSION: If a tutor does NOT teach "${studentNeeds.subject}" (look at their Subjects list), DO NOT rank them in the top 5, even if they have a 5.0 rating.
3. EXPLANATION: Write a brief, persuasive explanation in INDONESIAN. Mention why their expertise in "${studentNeeds.subject}" matches the student's needs.
4. RANKING: Rank from 1 (best) to 5.

Return ONLY a valid JSON array of objects:
[
  {
    "tutorId": "string (the tutor's _id)",
    "rank": number,
    "explanation": "string (explanation in Indonesian)"
  }
]

STUDENT NEEDS:
- Requested Subject: ${studentNeeds.subject}
- Difficulty: ${studentNeeds.difficulty || 'Menengah'}
- Learning Style: ${studentNeeds.learningStyle || 'Visual'}
- Preferred Time: ${studentNeeds.preferredTime}
- Specific Notes: ${studentNeeds.notes || 'None'}

AVAILABLE TUTOR DATA:
${tutors.map(t => `- ID: ${t._id}, Name: ${t.user?.name || t.name}, Subjects: ${t.subjects?.join(', ')}, Rating: ${t.rating || 5}, Bio: ${t.bio?.substring(0, 150)}...`).join('\n')}
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return null;
  }
}

