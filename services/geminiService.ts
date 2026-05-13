import { GoogleGenAI } from "@google/genai";
import { MergedData } from "../types";

const initGenAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeDataset = async (data: MergedData): Promise<string> => {
  try {
    const ai = initGenAI();
    
    // Prepare a sample of the data to avoid token limits
    // Take headers and first 10 rows + 5 random rows from middle
    const sampleRows = data.rows.slice(0, 10);
    const middleIndex = Math.floor(data.rows.length / 2);
    const randomRows = data.rows.slice(middleIndex, middleIndex + 5);
    
    const contextData = {
      totalRows: data.rows.length,
      headers: data.headers,
      sampleData: [...sampleRows, ...randomRows]
    };

    const prompt = `
      I have merged multiple Excel sheets into one dataset. 
      Here is a sample of the data in JSON format:
      \`\`\`json
      ${JSON.stringify(contextData, null, 2)}
      \`\`\`

      Please provide a concise analysis of this dataset.
      1. Identify what this data likely represents (Sales, Inventory, user logs, etc.).
      2. Point out any potential data quality issues visible in the sample (missing fields, inconsistent formatting).
      3. Suggest 3 key insights or questions a user might want to answer with this data.
      
      Keep the tone professional and helpful. Format using Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Data Analyst helping a user understand their merged spreadsheet data.",
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to generate analysis. Please try again or check your API key.";
  }
};
