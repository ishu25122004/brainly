import { ContentModel } from "./db.js";
import { GEMINI_API_KEY } from "./config.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generateEmbedding(text: string): Promise<number[] | null> {
    try {
        const response = await ai.models.embedContent({
            model: "gemini-embedding-2",
            contents: text,
        });
        if (response.embeddings && response.embeddings.length > 0) {
            return response.embeddings[0]?.values || null;
        }
        return null;
    } catch (e) {
        console.error("Failed to generate embedding:", e);
        return null;
    }
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        const valA = vecA[i] || 0;
        const valB = vecB[i] || 0;
        dotProduct += valA * valB;
        normA += valA * valA;
        normB += valB * valB;
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function generateChatResponse(question: string, contextTexts: string[]): Promise<string> {
    const contextStr = contextTexts.map((text, i) => `[Document ${i + 1}]:\n${text}`).join("\n\n");
    const prompt = `You are a highly capable AI assistant for a user's personal "Second Brain" application.
When the user asks questions about their notes, prioritize answering using the provided CONTEXT DOCUMENTS below.
If the context documents do not contain the answer, you are allowed to use your general knowledge to answer the question, but subtly mention that the information is from your general knowledge and not their notes.

IMAGE GENERATION CAPABILITY:
If the user explicitly asks you to generate, draw, or create an image/picture of something, you must respond with a markdown image tag using the Pollinations.ai engine. 
Format: ![description](https://image.pollinations.ai/prompt/{URL_ENCODED_PROMPT})
Example: If they ask for a futuristic city, output: ![A futuristic city](https://image.pollinations.ai/prompt/A%20futuristic%20city%20with%20flying%20cars%20and%20neon%20lights)
Make the prompt detailed for the best image results.

=== CONTEXT DOCUMENTS ===
${contextStr}
=========================

User Question: ${question}
Answer:`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        });
        return response.text || "Sorry, I couldn't generate an answer.";
    } catch (e) {
        console.error("Failed to generate chat response:", e);
        return "Sorry, I encountered an error while thinking.";
    }
}

export async function enrichContentWithAI(contentId: string, title: string, textContent: string, type: string) {
    try {
        const prompt = `Given the following content title, type, and text, provide a 1-sentence summary and up to 5 semantic tags.
Return ONLY a raw JSON object with no markdown formatting or backticks: { "summary": "...", "tags": ["tag1", "tag2"] }.

Title: ${title || ""}
Type: ${type || ""}
Text: ${textContent || ""}`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const text = response.text;
        if (!text) return;

        const data = JSON.parse(text);

        // Generate embedding for the combined title, summary, and actual content
        const embeddingText = `Title: ${title}. Summary: ${data.summary}. Content: ${(textContent || "").substring(0, 5000)}`;
        const embedding = await generateEmbedding(embeddingText);

        const updateData: any = {
            summary: data.summary,
        };
        
        if (embedding) {
            updateData.embedding = embedding;
        }

        await ContentModel.updateOne(
            { _id: contentId },
            { 
                $set: updateData,
                $addToSet: { tags: { $each: data.tags || [] } } 
            }
        );
        console.log(`Successfully enriched content ${contentId} with AI and Embedding`);
    } catch (e) {
        console.error("Failed to enrich content with AI:", e);
    }
}
