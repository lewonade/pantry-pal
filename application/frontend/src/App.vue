<template>
  <div>
    <input v-model="imageUrl" placeholder="Enter image URL" />
    <button @click="analyzeImage">Analyze Image</button>
    <div v-if="analysis">
      <h3>Analysis Result:</h3>
      <div v-if="analysis.text" v-html="formattedAnalysisText"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      imageUrl: "",
      analysis: null,
    };
  },
  computed: {
    formattedAnalysisText() {
      // Transform the text to include HTML formatting if necessary
      // This is a placeholder for any formatting logic you might have
      return this.analysis.text.replace(/\n/g, "<br>");
    },
  },
  methods: {
    async analyzeImage() {
      try {
        const response = await axios.post(
          "http://localhost:3000/analyze-image",
          { imageUrl: this.imageUrl }
        );
        console.log(response.data); // To check the actual response structure

        // Use the response if it fits the expected structure
        if (response.data && response.data.text) {
          // Setting the analysis result using the text property from the response
          this.analysis = {
            text: response.data.text || "No text analysis available.",
          };
        } else {
          // If the response does not have the expected structure
          this.analysis = { text: "No analysis results were found." };
        }
      } catch (error) {
        console.error("Error analyzing image:", error);
        this.analysis = { text: "Failed to analyze image due to an error." };
      }
    },
  },
};
</script>

<style>
.container {
}

.image-url-input,
.analyze-button {
}

.analysis-result {
}

.analysis-text {
}
</style>
