// Import required modules
require("dotenv").config();
const express = require("express");
const { OpenAI } = require("openai");

// Initialize Express and middleware
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

// Initialize OpenAI API with the API key
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Image analysis route
app.post("/analyze-image", async (req, res) => {
  console.log("Received request for image analysis");

  try {
    const { imageUrl } = req.body;
    console.log(`Processing image URL: ${imageUrl}`);

    // Send request to OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 500,
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Pantry Pal is designed to analyze images of a user's fridge or pantry and provide 3-6 diverse recipe suggestions based on the visible ingredients and a specific list of standard pantry items provided by the user. This list includes various spices, herbs, water, tea, coffee, oils & fats, canned goods, grain products, baking ingredients, and bread. The GPT will suggest recipes that can be completely prepared with the available ingredients. Each recipe suggestion will be accompanied by a detailed, step-by-step preparation guide, making it easy to understand and follow. The guide will include instructions on how to slice, cook, season, and assemble the dish, ensuring clarity for users of all cooking levels. Optional ingredients will be clearly marked, indicating they can be omitted. Pantry Pal's goal is to inspire culinary creativity and reduce food waste by helping users utilize what they have on hand, while ensuring the cooking process is accessible and enjoyable.",
            },
            { type: "image_url", image_url: imageUrl },
          ],
        },
      ],
    });

    // Process and format the response
    console.log("OpenAI API response:", response);
    const chatResponse = response.choices[0].message.content.trim();

    // Format the response for the frontend
    const formattedResponse = { text: chatResponse };

    // Send the formatted response
    res.json(formattedResponse);
  } catch (error) {
    console.error("Error in /analyze-image:", error);
    handleError(error, res);
  }
});

// Error handling function
function handleError(error, res) {
  if (error.response && error.response.status === 400) {
    if (!res.headersSent) {
      res
        .status(400)
        .send(
          "Invalid image URL. Please ensure the URL is correct and points directly to an image file."
        );
    }
  } else {
    if (!res.headersSent) {
      res.status(500).send("Error processing image");
    }
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
