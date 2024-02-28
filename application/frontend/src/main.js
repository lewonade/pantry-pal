// main.js
import './firebaseConfig';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createStore } from 'vuex';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// Import the initialized Firebase app and auth from firebaseConfig.js

const store = createStore({
	// Store configuration...
});
export const auth = getAuth();

let app;

onAuthStateChanged(auth, () => {
	if (!app) {
		app = createApp(App).use(router).use(store).mount('#app');
	}
});
