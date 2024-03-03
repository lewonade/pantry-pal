<template>
  <div class="container">
    <h1>Pantry-Pal</h1>
    <div class="menu-container">
      <img
        src="@/assets/gear.png"
        @click="toggleDropdownMenu"
        class="menu-trigger"
        alt="Menu"
      />

      <div v-if="showDropdownMenu" class="dropdown-menu" style="display: block">
        <button @click="logout" class="dropdown-item">Log Out</button>
      </div>
    </div>

    <button @click="toggleAllergies" class="analyze-btn">
      {{ allergiesButtonLabel }}
    </button>
    <div>
      <div class="allergy-checkboxes">
        <div v-if="showAllergies">
          <div v-for="allergy in allergies" :key="allergy">
            <input
              type="checkbox"
              :id="allergy"
              :value="allergy"
              v-model="selectedAllergies"
            />
            <label :for="allergy">{{ allergy }}</label>
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>

    <div v-if="imageSrc" class="image-preview">
      <img :src="imageSrc" alt="Uploaded image" class="uploaded-image" />
    </div>
    <div class="file-drop-container" v-show="!isLoading">
      <input
        type="file"
        id="file"
        class="file-input"
        @change="onFileSelected"
      />
      <label for="file" class="file-input-label">
        <span class="icon-upload">➕</span> Upload Image
      </label>
      <p class="drop-zone-text">
        Drop an image or choose one from your explorer<br />
        Supported formats: .png .jpeg .jpg .webp .heic
      </p>
    </div>

    <div class="analysis-result" v-if="analysis">
      <h3>Analysis Result:</h3>
      <div v-html="formattedMarkdown"></div>
    </div>
    <div class="loading" v-if="isLoading">
      <div class="loader"></div>
    </div>
  </div>
  <footer class="site-footer">
    <div class="footer-content">
      <p>© 2024 Pantry-Pal. All rights reserved.</p>
      <a href="https://rickroll.it/rickroll.mp4">Privacy Policy</a> |
      <a href="mailto:clemens.dancso@student.htldornbirn.at">Contact Us</a>
    </div>
  </footer>
</template>

<script>
import { signOut } from "firebase/auth";
import axios from "axios";
import { auth } from "../main.js";

export default {
  name: "HomePage",
  data() {
    return {
      showLogin: true,
      showAllergies: false,
      showDropdownMenu: false,
      selectedFile: null,
      analysis: null,
      isLoading: false,
      imageSrc: null,
      selectedAllergies: [],
      errorMessage: null,
      allergies: [
        "A - Cereals containing gluten",
        "B - Crustaceans",
        "C - Eggs",
        "D - Fish",
        "E - Peanuts",
        "F - Soy",
        "G - Milk or lactose",
        "H - Nuts",
        "L - Celery",
        "M - Mustard",
        "N - Sesame",
        "O - Sulfites",
        "P - Lupins",
        "R - Molluscs",
      ],
    };
  },
  computed: {
    allergiesButtonLabel() {
      return this.showAllergies ? "Hide Allergies" : "Show Allergies";
    },
    formattedMarkdown() {
      return this.analysis ? this.simpleMarkdownToHtml(this.analysis.text) : "";
    },
  },
  watch: {
    selectedAllergies(newVal) {
      this.saveAllergiesAutomatically(newVal);
    },
  },
  methods: {
    toggleDropdownMenu() {
      this.showDropdownMenu = !this.showDropdownMenu;
    },
    async logout() {
      try {
        await signOut(auth);
        window.location.reload();
      } catch (error) {
        console.error("Logout Error:", error);
      }
    },
    toggleAllergies() {
      this.showAllergies = !this.showAllergies;
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = e.target.result;
        this.$nextTick(() => {
          this.analyzeImage();
        });
      };
      reader.readAsDataURL(this.selectedFile);
    },
    async analyzeImage() {
      this.isLoading = true;

      const formData = new FormData();
      formData.append("image", this.selectedFile);

      try {
        const response = await axios.post(
          "http://localhost:3000/analyze-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        this.analysis = {
          text: response.data.text || "No text analysis available.",
        };
      } catch (error) {
        console.error("Error analyzing image:", error);
        this.analysis = { text: "Failed to analyze image due to an error." };
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          const analysisResultElement =
            document.querySelector(".analysis-result");
          if (analysisResultElement) {
            analysisResultElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      }
    },

    simpleMarkdownToHtml(markdownText) {
      const htmlText = markdownText
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
        .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
        .replace(/\*(.*)\*/gim, "<em>$1</em>")
        .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
        .replace(/\n/gim, "<br />");

      return htmlText.trim();
    },
    saveAllergiesAutomatically(selectedAllergies) {
      axios
        .post("http://localhost:3000/allergies", {
          text: selectedAllergies,
        })
        .then((response) => {
          console.log("Allergies saved:", response.data);
        })
        .catch((error) => {
          console.error("Error saving allergies:", error);
        });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap");

* {
  font-family: "Mulish", sans-serif;
}

.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
  width: 80%;
  max-width: 1000px;
  margin: auto;
  padding-bottom: 200px;
}

h1 {
  margin-bottom: 20px;
}

.menu-container {
  position: absolute;
  top: 0;
  right: 0;
}

.menu-trigger {
  width: 30px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.menu-trigger:hover {
  transform: scale(1.1);
}

.dropdown-menu {
  display: none;
  position: absolute;
  right: 0;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px 0;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  width: 100px;
}

.dropdown-menu .dropdown-item {
  width: fit-content;
  color: black;
  padding: 10px 20px;
  text-decoration: none;
  display: block;
  border-bottom: 1px solid #eee;
}

.dropdown-menu .dropdown-item:hover {
  background-color: #e6e6e6;
}

.dropdown-menu .dropdown-item:last-child {
  border-bottom: none;
}

.menu-container:hover .dropdown-menu {
  display: block;
}

.file-drop-container {
  border: 2px dashed #ddd;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  background: #f8f8f8;
  transition: background-color 0.3s;
  max-width: 600px;
  margin: auto;
}

.file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.file-input-label {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1.25rem;
  color: white;
  background-color: #4caf50;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  transition: all 0.3s;
}

.file-input-label:hover {
  background-color: #42c56e;
}
.file-drop-container:hover {
  background-color: #e3eaf1;
  color: white;
}

.file-input-label:active {
  transform: scale(0.98);
}

.drop-zone-text {
  color: #555;
  margin-top: 8px;
}

.analyze-btn {
  background-color: #4caf50;
  color: white;
  margin: 10px 0;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.analyze-btn:hover {
  background-color: #42c56e;
  color: white;
  margin: 10px 0;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.analyze-btn:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

.loader {
  display: inline-block;
  width: 80px;
  height: 80px;
  position: relative;
  border: 4px solid #f8f8f8;
  border-top-color: #005b97;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spinReverse {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.analysis-result {
  text-align: left;
  margin-top: 20px;
}

.image-preview {
  margin: 50px;
  text-align: center;
  border: 1px solid #ffffff;
  overflow: hidden;
  width: auto;
  max-width: 100%;
  border-radius: 15px;
}

.uploaded-image {
  width: 100%;
  height: auto;
  border-radius: 15px;
}

.site-footer {
  width: 100%;
  background-color: #f8f8f8;
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid #ddd;
  margin-top: 40px;
  position: fixed;
  bottom: 0;
}

.footer-content p,
.footer-content a {
  color: #555;
  font-size: 16px;
  text-decoration: none;
  margin: 0 10px;
}

.footer-content a:hover {
  text-decoration: underline;
}
</style>
