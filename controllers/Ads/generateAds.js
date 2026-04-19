import { User } from "../../models/User.js";
import { generateAdsWithGemini } from "../../utis/AI/gemini/generateAdsWithGemini.js";
import { generateAdsWithGroq } from "../../utis/AI/groq/generateAdsWithGroq.js";
import { Generation } from "../../models/Generation.js";

export const generateAds = async (req, res) => {
  try {
    const { product, audience, tone } = req.body;
    console.log("req.user: ", req.user);
    const { id } = req.user;
    const { modelName } = req.params;

    if (!product || !audience || !tone) {
      return res.status(400).json({
        success: false,
        message: "Product, audience and tone are required",
      });
    }

    const user = await User.findById(id);
    if (!user || user.quota <= 0) {
      return res.status(400).json({
        success: false,
        code: "QUOTA_EXCEEDED",
        message: "Generation limit Exceed",
      });
    }

    let ads;
    if (modelName === "Gemini")
      ads = await generateAdsWithGemini({
        product,
        audience,
        tone,
      });
    else
      ads = await generateAdsWithGroq({
        product,
        audience,
        tone,
      });

    // 🔥 IMPORTANT: decrease quota AFTER success
    user.quota -= 1;
    await user.save();

    // 🔥 save generation history
    const generation = await Generation.create({
      user: id,
      product,
      audience,
      tone,
      model: modelName,
      ads,
    });

    // 🔗 attach to user
    await User.findByIdAndUpdate(id, {
      $push: { generations: generation._id },
    });

    res.json({
      success: true,
      ads,
      quota: user.quota,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "AI generation failed",
    });
  }
};
