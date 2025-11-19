import { GoogleGenerativeAI } from "@google/generative-ai";

// It's better to use environment variables for API keys
const API_KEY = process.env.GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Ask Gemini model a prompt and get back plain text.
 * @param prompt - The input prompt string
 * @returns The model's plain text response
 */
export default async function askGemini(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Be direct: " + prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API error:", error.message);
    throw new Error("Failed to get response from Gemini.");
  }
}
