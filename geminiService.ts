
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { TransactionCategory } from "./types";

export const extractBankData = async (fileBase64: string, mimeType: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are an expert financial auditor and OCR specialist.
    Your task is to extract structured transaction data from bank statement images or PDFs.
    
    GUIDELINES:
    1. Extract every transaction listed in the document.
    2. Clean descriptions to be readable (remove redundant codes if possible but keep essential merchant names).
    3. Identify Amounts clearly: Negative for Debits/Expenses, Positive for Credits/Income.
    4. Auto-categorize each transaction into one of these: ${Object.values(TransactionCategory).join(', ')}.
    5. If a Transaction ID is not explicitly present, use 'NA'.
    6. Combine multi-line descriptions into a single clean string.
    7. Ignore headers, footers, and summary tables in the final transactions list, but use them for the summary object.
    8. Return strictly valid JSON.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      transactions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: "ISO format date YYYY-MM-DD" },
            transactionId: { type: Type.STRING },
            description: { type: Type.STRING },
            amount: { type: Type.NUMBER, description: "Positive for credit, negative for debit" },
            category: { type: Type.STRING, enum: Object.values(TransactionCategory) },
            notes: { type: Type.STRING }
          },
          required: ["date", "description", "amount", "category"]
        }
      },
      summary: {
        type: Type.OBJECT,
        properties: {
          totalCredits: { type: Type.NUMBER },
          totalDebits: { type: Type.NUMBER },
          statementPeriod: { type: Type.STRING },
          accountNumber: { type: Type.STRING }
        }
      }
    },
    required: ["transactions", "summary"]
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { inlineData: { data: fileBase64, mimeType } },
            { text: "Extract the transaction data from this bank statement as JSON." }
          ]
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};
