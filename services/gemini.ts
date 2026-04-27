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
    const model = genAI.getGenerativeModel({
      model: "gemma-3-27b-it"
    });

    let validHistory: any[] = [];
    let expectedRole = "user";

    for (const msg of history) {
      if (msg.role === expectedRole) {
        validHistory.push({ role: msg.role, parts: msg.parts });
        expectedRole = expectedRole === "user" ? "model" : "user";
      }
    }

    if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === "user") {
      validHistory.pop();
    }

    const contents = [...validHistory, { role: "user", parts: [{ text: userMessage }] }];

    // Inject system instruction into the first user message manually
    if (contents.length > 0 && contents[0].role === "user") {
      contents[0].parts[0].text = `System Instruction:\n${SYSTEM_PROMPT}\n\nUser Request:\n${contents[0].parts[0].text}`;
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request Timeout")), 15000);
    });

    const result = await Promise.race([
      model.generateContent({ contents }),
      timeoutPromise
    ]);

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
      model: "gemma-3-27b-it"
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request Timeout")), 15000);
    });

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return null;
  }
}

export async function generateStudyPlan(subject: string, goal: string, hoursPerDay: number, durationDays: number) {
  if (!API_KEY) {
    console.error("Gemini API Key is missing!");
    return null;
  }

  const prompt = `You are an expert AI Study Planner. Create a highly structured, day-by-day study plan for a student.
  
  Student Parameters:
  - Subject: ${subject}
  - Goal: ${goal}
  - Available Time: ${hoursPerDay} hours per day
  - Duration: ${durationDays} days
  
  Rules:
  1. Return ONLY valid JSON, no markdown formatting (do not wrap in \`\`\`json).
  2. The JSON structure MUST exactly match:
  {
    "title": "Study Plan for [Subject]",
    "overview": "Brief 1-sentence motivation/overview",
    "days": [
      {
        "dayNumber": 1,
        "title": "Focus of the day",
        "topics": ["Topic 1", "Topic 2"],
        "estimatedHours": 2
      }
    ]
  }
  3. Ensure there are exactly ${durationDays} items in the "days" array.
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemma-3-27b-it"
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request Timeout")), 15000);
    });

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Study Planner Error:", error);
    return null;
  }
}

