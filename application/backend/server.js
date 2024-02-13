require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { OpenAI } = require('openai');
const admin = require('firebase-admin');
const serviceAccount = require('./config/pantry-pal-1f549-firebase-adminsdk-2vvt8-6e0d32d74d.json'); // Adjust path as necessary

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Initialize Firebase Admin SDK
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	storageBucket: 'pantry-pal-1f549.appspot.com', // Replace with your Firebase Storage bucket name
});
const bucket = admin.storage().bucket();

const app = express();
app.use(express.json());
app.use(cors());

// Set up Multer for file handling
const storage = multer.memoryStorage(); // Use memory storage for files before uploading to Firebase
const upload = multer({ storage: storage });

app.post('/analyze-image', upload.single('image'), async (req, res) => {
	console.log('Received request for image analysis');

	if (!req.file) {
		return res.status(400).send('No file uploaded.');
	}

	const fileName = Date.now() + '-' + req.file.originalname;
	const file = bucket.file(fileName);

	// Upload file to Firebase Storage
	const stream = file.createWriteStream({
		metadata: {
			contentType: req.file.mimetype,
		},
	});

	stream.on('finish', async () => {
		// Make the file public
		await file.makePublic();

		const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
		console.log(`File uploaded to ${publicUrl}`);

		// Now you can use `publicUrl` with the OpenAI API
		try {
			const response = await openai.chat.completions.create({
				model: 'gpt-4-vision-preview',
				max_tokens: 500,
				temperature: 0.3,
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: "Pantry Pal is designed to analyze images of a user's fridge or pantry and provide 3-6 diverse recipe suggestions based on the visible ingredients and a specific list of standard pantry items provided by the user. This list includes various spices, herbs, water, tea, coffee, oils & fats, canned goods, grain products, baking ingredients, and bread. The GPT will suggest recipes that can be completely prepared with the available ingredients. Each recipe suggestion will be accompanied by a detailed, step-by-step preparation guide, making it easy to understand and follow. The guide will include instructions on how to slice, cook, season, and assemble the dish, ensuring clarity for users of all cooking levels. Optional ingredients will be clearly marked, indicating they can be omitted. Pantry Pal's goal is to inspire culinary creativity and reduce food waste by helping users utilize what they have on hand, while ensuring the cooking process is accessible and enjoyable.",
							},
							{
								type: 'image_url',
								image_url: publicUrl,
							},
						],
					},
				],
			});

			console.log('OpenAI API response:', response);
			const chatResponse = response.choices[0].message.content.trim();
			res.json({ text: chatResponse });
		} catch (error) {
			console.error('Error in OpenAI API request:', error);
			res.status(500).send('Error processing image analysis');
		}
	});

	// Add an error event handler for the stream
	stream.on('error', (error) => {
		console.error('Stream error:', error);
		res.status(500).send('Stream error in file upload');
	});

	stream.end(req.file.buffer);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
