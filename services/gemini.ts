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
    // Gunakan model: gemini-2.5-flash (sesuai permintaan user)
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
