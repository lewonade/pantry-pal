<template>
	<div>
		<input
			type="file"
			@change="handleFileUpload"
			id="fileUpload"
			multiple
			style="display: none"
		/>
		<label for="fileUpload" class="custom-button">
			<span class="plus">+</span> Upload Image
		</label>
		<div class="image-previews">
			<div
				v-for="(image, index) in imagePreviews"
				:key="index"
				class="image-preview-container"
			>
				<img :src="image" class="preview-image" />
				<div class="remove-image" @click="removeImage(index)">
					<span class="x-background">✖</span>
				</div>
				<div class="image-preview-actions">
					<button @click="submitImage" class="submit-button">
						What can I cook?
					</button>
				</div>
			</div>
		</div>
		<div v-if="response" class="response">
			<h3>Recipe Suggestions:</h3>
			<p>{{ response }}</p>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			selectedFiles: [],
			response: null,
			imagePreviews: [],
			hover: null, // Add a data property to keep track of hover state
		};
	},
	methods: {
		handleFileUpload(event) {
			const files = Array.from(event.target.files);
			this.selectedFiles = files.slice(0, 5); // Limit to 5 files
			this.imagePreviews = this.selectedFiles.map((file) =>
				URL.createObjectURL(file)
			);
		},
		removeImage(index) {
			this.imagePreviews.splice(index, 1);
			this.selectedFiles.splice(index, 1);
			// Reset the hover state if needed
			if (this.hover === index) {
				this.hover = null;
			}
		},
		async submitImage() {
			const formData = new FormData();
			formData.append('fridgeImage', this.selectedFile);

			const res = await fetch('http://localhost:3000/analyze-fridge', {
				method: 'POST',
				body: formData,
			});

			const data = await res.json();
			this.response = data.choices[0].text;
		},
	},
};
</script>

<style scoped>
div {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background-color: #f4f4f4;
	font-family: 'Arial', sans-serif;
}

input[type='file'] {
	padding: 10px;
	margin: 15px;
	border: 1px solid #ddd;
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.3s ease;
}

input[type='file']:hover {
	background-color: #eaeaea;
}

button {
	padding: 10px 20px;
	color: white;
	background-color: #4caf50;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.3s ease;
}

button:hover {
	background-color: #45a049;
}

.response {
	margin-top: 20px;
	padding: 15px;
	border-radius: 5px;
	background-color: #fff;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	width: 80%;
	max-width: 600px;
}

h3 {
	color: #333;
}

p {
	color: #666;
}

.custom-button {
	display: inline-block;
	padding: 10px 20px;
	color: white;
	background-color: #4caf50;
	border: none;
	border-radius: 15px; /* Smooth corners */
	cursor: pointer;
	transition: all 0.3s ease;
}

.custom-button:hover {
	background-color: #45a049;
}

.plus {
	color: white;
	font-size: 20px;
}
.image-preview-container:hover .remove-image {
	display: flex; /* Show on hover with flex to keep the content centered */
}

.image-previews {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-top: 15px;
	position: relative; /* Add position relative here */
}

.image-preview-container {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: auto;
	margin: 10px;
}

.image-preview-actions {
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-top: 5px; /* Add margin to separate actions from the image */
}

.preview-image {
	max-width: 50%; /* Maximum width at 50% of the parent container */
	height: auto; /* Ensure the height is auto to maintain aspect ratio */
	object-fit: cover; /* Cover to ensure the image covers the area */
	border-radius: 4px; /* Maintain the border-radius if desired */
}

.submit-button {
	padding: 5px 10px;
	font-size: 12px;
	margin-right: auto; /* Push the button to the left */
}

.x-background {
	font-size: 14px; /* Adjust font size of X */
	color: black; /* Set X color */
}
.remove-image {
	position: absolute;
	top: 0;
	right: 0;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: white;
	border-radius: 50%;
	width: 20px;
	height: 20px;
	margin-right: 10px;
	margin-top: 10px;
	box-sizing: content-box;
	border: 1px solid black;
}
</style>
