import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.GEMINI_API;

const genAI = new GoogleGenerativeAI(API_KEY);

export async function generate(prompt) {
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // const prompt = "Write a story about a magic backpack.";

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return String(text);
}

