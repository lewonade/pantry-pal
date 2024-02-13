<template>
	<div>
		<input type="file" @change="onFileSelected" />
		<button @click="analyzeImage">Analyze Image</button>
		<div v-if="analysis">
			<h3>Analysis Result:</h3>
			<div v-if="analysis.text" v-html="formattedAnalysisText"></div>
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
		};
	},
	computed: {
		formattedAnalysisText() {
			return this.analysis.text.replace(/\n/g, '<br>');
		},
	},
	methods: {
		onFileSelected(event) {
			this.selectedFile = event.target.files[0];
		},
		async analyzeImage() {
			if (!this.selectedFile) {
				alert('Please select a file first.');
				return;
			}

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

				// Assuming your backend sends back a response in the format of { text: "Your analysis result here" }
				this.analysis = {
					text: response.data.text || 'No text analysis available.',
				};
			} catch (error) {
				console.error('Error analyzing image:', error);
				this.analysis = { text: 'Failed to analyze image due to an error.' };
			}
		},
	},
};
</script>
