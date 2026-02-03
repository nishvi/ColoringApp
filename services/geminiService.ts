
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateLineArt = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const fullPrompt = `A high-quality, simple black and white line art coloring page for kids. 
    Subject: ${prompt}. 
    Pure white background, clean bold black outlines, no grey areas, no shading, minimal detail, 
    professional line art, coloring book style.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: fullPrompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to generate line art.");
};

export const colorLineArt = async (lineArtBase64: string, originalPrompt: string): Promise<string> => {
  const ai = getAI();
  // Extract pure base64
  const base64Data = lineArtBase64.split(',')[1];
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/png',
          },
        },
        {
          text: `Please color this line art vibrantly for a child's coloring book. 
            Maintain the exact same shapes and characters. 
            Make it colorful, cheerful, and bright. The subject is ${originalPrompt}.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to color the image.");
};
