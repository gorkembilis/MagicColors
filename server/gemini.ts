import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY!,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export async function generateColoringPage(prompt: string): Promise<string> {
  const fullPrompt = `Create a simple, child-friendly black and white line-art coloring page of: ${prompt}. 
  The image should have:
  - Clear, bold outlines suitable for coloring
  - Simple shapes appropriate for children
  - No shading or gradients, only black lines on white background
  - Fun and engaging design`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const candidate = response.candidates?.[0];
  const imagePart = candidate?.content?.parts?.find((part: any) => part.inlineData);

  if (!imagePart?.inlineData?.data) {
    throw new Error("No image data in response");
  }

  const mimeType = imagePart.inlineData.mimeType || "image/png";
  return `data:${mimeType};base64,${imagePart.inlineData.data}`;
}

export async function generateColorfulPuzzleImage(prompt: string): Promise<string> {
  const fullPrompt = `Create a colorful, vibrant, child-friendly cartoon illustration of: ${prompt}. 
  The image should have:
  - Bright, vivid colors that children love
  - Simple cartoon style with clear shapes
  - Fun and cheerful atmosphere
  - Suitable for a children's puzzle game
  - Square aspect ratio composition`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const candidate = response.candidates?.[0];
  const imagePart = candidate?.content?.parts?.find((part: any) => part.inlineData);

  if (!imagePart?.inlineData?.data) {
    throw new Error("No image data in response");
  }

  const mimeType = imagePart.inlineData.mimeType || "image/png";
  return `data:${mimeType};base64,${imagePart.inlineData.data}`;
}
