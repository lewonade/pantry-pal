import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyBB8qIjRo4ZUFbEAt29fmXooWUajAoVo9M',

	authDomain: 'pantry-pal-1f549.firebaseapp.com',

	databaseURL:
		'https://pantry-pal-1f549-default-rtdb.europe-west1.firebasedatabase.app',

	projectId: 'pantry-pal-1f549',

	storageBucket: 'pantry-pal-1f549.appspot.com',

	messagingSenderId: '258612347499',

	appId: '1:258612347499:web:ca80710a19ee9f5dd7272e',

	measurementId: 'G-DTV18Y6MMH',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth }; // Export for use in other files
