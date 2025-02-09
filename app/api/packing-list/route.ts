import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Fallback list in case of API issues
const fallbackList = [
  "Driver's license",
  "Insurance documents",
  "Phone charger",
  "First aid kit",
  "Water bottles",
  "Snacks",
  "Emergency kit",
  "Phone mount",
  "Sunglasses",
  "Hand sanitizer",
];

export async function POST(request: Request) {
  console.log("API route handler started");
  try {
    const { startLocation, endLocation } = await request.json();
    console.log("Received locations:", { startLocation, endLocation });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not configured");
      throw new Error("GEMINI_API_KEY is not configured");
    }

    console.log("Initializing Gemini API with key length:", apiKey.length);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Create a packing list for a road trip from ${startLocation} to ${endLocation}.
    Include essential items in these categories:
    1. Documents and money
    2. Clothing and accessories
    3. Electronics and chargers
    4. Food and drinks
    5. Car essentials
    6. Personal care items
    7. First aid and medications

    Format your response as a simple list with one item per line.
    Do not include any numbers, bullet points, or category headers.
    Each line should be just the item name.
    Keep the list concise with only the most important items.`;

    console.log("Sending prompt to Gemini...");
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log("Raw response from Gemini:", text);

      // Split the text into lines and clean up
      let items = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0) // Remove empty lines
        .map((line) => {
          // Remove any leading numbers, dashes, asterisks, or dots
          return line.replace(/^[\d\-\*\.\s]+/, "").trim();
        })
        .filter(
          (line) =>
            line.length > 0 &&
            !line.includes(":") && // Remove category headers
            !line.match(/^(category|section|items)/i) // Remove common header words
        );

      console.log("Processed items:", items);

      if (items.length === 0) {
        console.log("No items generated, using fallback list");
        throw new Error("No items were extracted from the API response");
      }

      // If we have too many items, take the first 20
      if (items.length > 20) {
        items = items.slice(0, 20);
      }

      return NextResponse.json({
        items,
        source: "gemini",
      });
    } catch (geminiError) {
      console.error("Gemini API Error:", geminiError);
      throw new Error(
        `Gemini API Error: ${
          geminiError instanceof Error
            ? geminiError.message
            : String(geminiError)
        }`
      );
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({
      items: fallbackList,
      source: "fallback",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
