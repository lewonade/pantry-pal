<template>
	<div class="container">
		<h1>Pantry-Pal</h1>
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
			selectedFile: null,
			analysis: null,
			isLoading: false,
			imageSrc: null,
		};
	},
	computed: {
		formattedMarkdown() {
			return this.analysis ? this.simpleMarkdownToHtml(this.analysis.text) : '';
		},
	},
	methods: {
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
