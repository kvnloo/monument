import { GoogleGenAI } from "@google/genai";
import { GEMINI_SYSTEM_INSTRUCTION } from "../constants";

// Initialize Gemini client (API key expected in environment)
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateResearch = async (prompt: string): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key found for Gemini.");
    return "API Key is missing. Please verify your environment configuration.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 1024 }, // Allow some thinking for complex architectural questions
      },
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while consulting the Architect AI.";
  }
};