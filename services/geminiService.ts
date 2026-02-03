import { GoogleGenAI } from "@google/genai";

declare var process: {
  env: {
    API_KEY: string;
  };
};

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLineArt = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const fullPrompt = `A high-quality, professional black and white line art coloring page for young children. 
    Subject: ${prompt}. 
    Style: Bold, thick clean black outlines, pure white background, zero grayscale, no shading, no gradients, 
    large areas to color, extremely simple shapes, whimsical and friendly character design, professional 
    children's coloring book style. Only output the line art image.`;

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
          text: `Please color this line art vibrantly for a child's coloring book preview. 
            The subject is ${originalPrompt}. 
            Instructions: Use bright, happy, cheerful primary and secondary colors. 
            Keep the black outlines perfectly intact. Make it look like it was colored 
            beautifully with markers or crayons. Colorful and fun background.`,
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
