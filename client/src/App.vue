<template>
	<div>
		<input type="file" @change="handleFileUpload" />
		<button @click="submitImage">What can I cook?</button>
		<div v-if="response">
			<h3>Recipe Suggestions:</h3>
			<p>{{ response }}</p>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			selectedFile: null,
			response: null,
		};
	},
	methods: {
		handleFileUpload(event) {
			this.selectedFile = event.target.files[0];
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
