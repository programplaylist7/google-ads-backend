// services/groq/generateAdsWithGroq.js

import Groq from "groq-sdk";

// ✅ Initialize Groq with API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Helper: Clean invalid JSON from LLM
const cleanAndParseJSON = (rawText) => {
  try {
    // 🧹 Remove markdown (```json ``` if present)
    let cleaned = rawText.replace(/```json|```/g, "").trim();

    // 🧹 Fix JS-style string concatenation ("..." + "...")
    cleaned = cleaned.replace(/"\s*\+\s*"/g, "");

    // 🧹 Remove line breaks
    cleaned = cleaned.replace(/\n/g, " ");

    return JSON.parse(cleaned);

  } catch (err) {
    console.log("❌ FINAL RAW OUTPUT:", rawText);
    throw new Error("Invalid JSON from Groq");
  }
};

// ✅ Helper: Validate & normalize output
const validateAds = (data) => {
  if (!data?.ads || !Array.isArray(data.ads)) {
    throw new Error("Invalid ads format");
  }

  return {
    ads: data.ads.map((ad) => ({
      // ✅ ensure exactly 2 headlines
      headlines: (ad.headlines || []).slice(0, 2).map((h) =>
        h.slice(0, 30) // enforce max 30 chars
      ),

      // ✅ ensure exactly 2 descriptions
      descriptions: (ad.descriptions || []).slice(0, 2).map((d) =>
        d.slice(0, 90) // enforce max 90 chars
      ),
    })),
  };
};

// 🎯 Main function
export const generateAdsWithGroq = async (input) => {
  const { product, audience, tone } = input;

  const prompt = `
Generate EXACTLY 3 Google Ads.

STRICT RULES:
- Each ad must have EXACTLY 3 headlines
- Each headline MUST be <= 30 characters
- Each ad must have EXACTLY 3 descriptions
- Each description MUST be <= 90 characters
- DO NOT use string concatenation (+)
- DO NOT add extra fields
- Output must be STRICT JSON only

Return ONLY JSON in this format:
{
  "ads": [
    {
      "headlines": ["", ""],
      "descriptions": ["", ""]
    }
  ]
}

Input:
Product: ${product}
Audience: ${audience}
Tone: ${tone || "professional"}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ fast + good
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // 📥 Extract text
    const rawText = completion.choices[0]?.message?.content || "";

    console.log("🧠 GROQ RAW:", rawText);

    // 🧹 Clean + parse
    const parsed = cleanAndParseJSON(rawText);

    // ✅ Validate + normalize
    const finalData = validateAds(parsed);

    return finalData;

  } catch (err) {
    console.error("🔥 GROQ ERROR:", err);
    throw new Error(err.message || "Groq API failed");
  }
};