import { GoogleGenAI } from "@google/genai";
import { productService } from './productService';
import { formatUsd, formatUgxFromUsd } from './currency';

const apiKey = process.env.API_KEY || '';

export const geminiService = {
  async sendMessage(history: string[], userMessage: string): Promise<string> {
    if (!apiKey) {
      return "I'm sorry, the AI service is not configured (Missing API Key).";
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const products = productService.getApprovedProducts();
      
      // Construct a lean string representation of products to save tokens
      const productContext = products.map(p => 
        `- ${p.name}: ${formatUsd(p.price)} (${formatUgxFromUsd(p.price)}) (ID: ${p.id}). ${p.description}`
      ).join('\n');

      const systemInstruction = `
        You are a helpful shopping assistant for GlovoMarket.
        You have access to the following list of AVAILABLE APPROVED products:
        
        ${productContext}
        
        Rules:
        1. Only recommend products from this list.
        2. If a user asks for something not on the list, apologize and say it's not available.
        3. Be concise, friendly, and helpful.
        4. Do not make up prices or products.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      return response.text || "I'm having trouble thinking right now.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Sorry, I encountered an error while processing your request.";
    }
  }
};