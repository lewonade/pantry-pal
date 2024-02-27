<template>
	<div class="container">
		<h1>Pantry-Pal</h1>
		
		<button @click="toggleAllergies" class="analyze-btn">{{ allergiesButtonLabel }}</button>
		<div>
            <div class="allergy-checkboxes">
				<div v-if="showAllergies">
					<div v-for="allergy in allergies" :key="allergy">
						<input type="checkbox" :id="allergy" :value="allergy" v-model="selectedAllergies">
						<label :for="allergy">{{ allergy }}</label>
					</div>
				</div>
            </div>   
        </div>

		<button @click="saveAllergies" class="analyze-btn">Save Allergies</button>
		
		<div v-if="imageSrc" class="image-preview">
			<h3>Preview Image</h3>
			<img :src="imageSrc" alt="Uploaded image" class="uploaded-image" />
		</div>
		<input type="file" @change="onFileSelected" class="choose-btn" />
		<button @click="analyzeImage" class="analyze-btn" :disabled="isLoading">
			Analyze Image
		</button>
		<div class="analysis-result" v-if="analysis">
			<h3>Analysis Result:</h3>
			<div v-html="formattedMarkdown"></div>
		</div>
		<div class="loading" v-if="isLoading">
			<span>Loading...</span>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			showAllergies: false,
			selectedFile: null,
			analysis: null,
			isLoading: false,
			imageSrc: null,
			selectedAllergies: [],
			allergies: [
				"A - glutenhaltiges Getreide",
				"B - Krebstiere",
				"C - Ei",
				"D - Fisch",
				"E - Erdnuss",
				"F - Soja",
				"G - Milch oder Laktose",
				"H - Schalenfrüchte",
				"L - Sellerie",
				"M - Senf",
				"N - Sesam",
				"O - Sulfite",
				"P - Lupinen",
				"R - Weichtiere"
					]
		};
	},
	computed: {
		allergiesButtonLabel() {
            return this.showAllergies ? 'Hide Allergies' : 'Show Allergies';
        },
		formattedMarkdown() {
			return this.analysis ? this.simpleMarkdownToHtml(this.analysis.text) : '';
		},
	},
	methods: {
		toggleAllergies() {
			console.log(this.showAllergies);
            this.showAllergies = !this.showAllergies;
			console.log(this.showAllergies);
        },

        saveAllergies() {
            console.log("Selected Allergies:", this.selectedAllergies);
            // Hier können Sie die Logik zum Speichern der Allergien implementieren,
            // z.B. einen API-Aufruf, um die Auswahl zu speichern.
        },

		onFileSelected(event) {
			this.selectedFile = event.target.files[0];
			this.createImageSrc(this.selectedFile);
		},
		createImageSrc(file) {
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					this.imageSrc = e.target.result;
				};
				reader.readAsDataURL(file);
			}
		},
		async analyzeImage() {
			if (!this.selectedFile) {
				alert('Please select a file first.');
				return;
			}

			this.isLoading = true;

			const formData = new FormData();
			formData.append('image', this.selectedFile);

			try {
				const response = await axios.post(
					'http://localhost:3000/analyze-image',
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				);

				this.analysis = {
					text: response.data.text || 'No text analysis available.',
				};
			} catch (error) {
				console.error('Error analyzing image:', error);
				this.analysis = { text: 'Failed to analyze image due to an error.' };
			} finally {
				this.isLoading = false;
			}
		},
		simpleMarkdownToHtml(markdownText) {
			const htmlText = markdownText
				.replace(/^### (.*$)/gim, '<h3>$1</h3>')
				.replace(/^## (.*$)/gim, '<h2>$1</h2>')
				.replace(/^# (.*$)/gim, '<h1>$1</h1>')
				.replace(/^ (.*$)/gim, '<blockquote>$1</blockquote>')
				.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
				.replace(/\*(.*)\*/gim, '<em>$1</em>')
				.replace(/\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
				.replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
				.replace(/\n$/gim, '<br />');

			return htmlText.trim();
		},
	},
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap');

* {
	font-family: 'Mulish', sans-serif;
}

.label {
  margin-bottom: 0.5em; /* Space between label and select */
  font-size: 1.2em;
  color: #333; /* Update color as needed */
  font-weight: bold;
}

.select {
  width: 100%; /* Make select fill the container width */
  max-width: 400px; /* Set a max-width for larger screens */
  padding: 10px;
  border: 1px solid #ccc;
  font-size: 1em;
  cursor: pointer;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
}

.select:hover {
  border-color: darkgray; /* Darker gray border on hover */
}

.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start; /* Changed to start at the top */
	padding-top: 20px; /* Added padding at the top */
	width: 80%; /* Adjust the width as needed */
	margin: auto; /* Center the container */
}

h1 {
	margin-bottom: 20px; /* Space between the title and the rest */
}

.choose-btn,
.analyze-btn {
	margin: 10px 0;
	padding: 10px 20px;
	border: 1px solid black;
	border-radius: 4px;
	cursor: pointer; /* Add a pointer cursor on hover */
}

.choose-btn {
	background-color: #f8f8f8;
}

.analyze-btn {
	background-color: #4caf50; /* Green color */
	color: white;
}

.analyze-btn:disabled {
	background-color: #ccc;
	color: #666;
	cursor: not-allowed; /* Show that it's not clickable */
}

.loading {
	display: flex;
	justify-content: center;
	margin-top: 20px; /* Added margin */
}

.loading-circle {
	border: 5px solid #f3f3f3;
	border-top: 5px solid #3498db;
	border-radius: 50%;
	width: 50px;
	height: 50px;
	animation: spin 2s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.analysis-result {
	text-align: center;
	margin-top: 20px; /* Added margin */
}

.image-preview {
	margin: 10px;
	text-align: center;
	border: 1px solid #ddd; /* Added border */
	padding: 5px; /* Added padding */
	width: 300px; /* Fixed width for consistency */
}

.uploaded-image {
	max-width: 100%;
	height: auto; /* Ensure the aspect ratio is maintained */
	border-radius: 4px; /* Rounded corners for the image */
}
</style>
