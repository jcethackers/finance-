import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Transaction, AIInsight } from '../types';
import { INITIAL_SYSTEM_INSTRUCTION } from '../constants';

// We assume the API key is available via process.env.API_KEY
// In a real hackathon setting, ensure this environment variable is set.
const apiKey = process.env.API_KEY || ''; 

let chatSession: Chat | null = null;

const ai = new GoogleGenAI({ apiKey });

export const initializeChat = (transactions: Transaction[]) => {
  if (!apiKey) {
    console.warn("Gemini API Key missing. Chat features will be disabled or mock responses used.");
    return;
  }

  // Minimize context for tokens, but provide enough for analysis
  const simplifiedTransactions = transactions.map(t => 
    `${t.date}: ${t.description} ($${t.amount}) - ${t.category}`
  ).join('\n');

  const contextPrompt = `
    Here is the user's transaction history for the current period:
    ${simplifiedTransactions}
    
    Use this data to answer their questions.
  `;

  chatSession = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: INITIAL_SYSTEM_INSTRUCTION + "\n" + contextPrompt,
      thinkingConfig: {
        thinkingBudget: 32768, 
      }
    },
  });
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    return "AI service is not initialized. Please ensure your API key is set.";
  }

  try {
    const result: GenerateContentResponse = await chatSession.sendMessage({ message });
    return result.text || "I couldn't analyze that right now. Try asking differently.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered an error connecting to the financial brain. Please try again.";
  }
};

export const generateInitialInsights = async (transactions: Transaction[]): Promise<AIInsight[]> => {
  if (!apiKey) {
    return [
      {
        id: 'mock1',
        title: 'Demo Insight',
        description: 'This is a placeholder because no API Key was detected.',
        type: 'neutral',
        actionable: 'Add your API Key to .env'
      }
    ];
  }

  const simplifiedTransactions = transactions.slice(0, 50).map(t => 
    `${t.description}: $${t.amount} (${t.category})`
  ).join('; ');

  const prompt = `
    Analyze these transactions: [${simplifiedTransactions}]
    
    Provide exactly 3 short, punchy insights in JSON format.
    Schema:
    [
      {
        "title": "Short Headline",
        "description": "Explanation of finding",
        "type": "warning" | "success" | "prediction",
        "actionable": "One clear advice"
      }
    ]
    
    Focus on:
    1. Unusually high spending categories.
    2. Subscription patterns.
    3. Positive reinforcement if savings look good.
    Return ONLY raw JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return [];

    // Parse the JSON list
    const parsed = JSON.parse(text);
    return parsed.map((item: any, index: number) => ({
      id: `gen-${index}`,
      ...item
    }));

  } catch (error) {
    console.error("Insight Generation Error:", error);
    return [
      {
        id: 'err1',
        title: 'Analysis Unavailable',
        description: 'Could not contact the AI service right now.',
        type: 'neutral'
      }
    ];
  }
};