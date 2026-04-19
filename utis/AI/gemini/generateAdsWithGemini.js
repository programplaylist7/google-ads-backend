import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateAdsWithGemini = async (input) => {
  const { product, audience, tone } = input;

  const prompt = `
Generate 3 Google Ads Responsive Search Ads.

Rules:
- Headlines max 30 characters
- Descriptions max 90 characters
- Include CTA
- Engaging tone
- Each ad must have EXACTLY 3 descriptions and 3 Headlines

Return ONLY valid JSON:
{
  "ads": [
    {
      "headlines": [],
      "descriptions": []
    }
  ]
}

Input:
Product: ${product}
Audience: ${audience}
Tone: ${tone || "professional"}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const text = response.text;
    const cleaned = text.replace(/```json|```/g, "").trim();
    console.log("cleaned: ", cleaned);
    const parsedData = await JSON.parse(cleaned);
    return parsedData;
  } catch (err) {
    throw new Error("Gemini API failed");
  }
};
