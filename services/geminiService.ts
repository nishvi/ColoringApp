import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateLineArt = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const fullPrompt = `Create a high-quality, professional black and white line art coloring page for young children. 
    Subject: ${prompt}. 
    Style: Extremely bold, thick clean black outlines, pure white background, zero grayscale, no shading, no gradients, 
    large simple areas to color, whimsical and friendly character design. 
    Make it look like a high-end coloring book page. Only output the line art image.`;

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

  const candidates = response.candidates;
  if (candidates && candidates.length > 0) {
    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("Failed to generate line art.");
};

export const colorLineArt = async (lineArtBase64: string, originalPrompt: string): Promise<string> => {
  const ai = getAI();
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
          text: `Vibrantly color this line art for a child's coloring book preview. 
            The subject is ${originalPrompt}. 
            Instructions: Use bright, cheerful primary and secondary colors. 
            Keep the black outlines perfectly intact. Make it look like a beautifully finished marker drawing. 
            Add a simple, colorful, happy background.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  const candidates = response.candidates;
  if (candidates && candidates.length > 0) {
    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("Failed to color the image.");
};
