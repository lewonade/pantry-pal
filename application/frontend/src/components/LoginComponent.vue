<template>
	<div class="login-container">
		<h2>Login</h2>
		<input v-model="email" type="email" placeholder="Email" />
		<input v-model="password" type="password" placeholder="Password" />
		<button @click="login">Login</button>
		<button @click="navigateToSignUp">Sign Up Instead</button>

		<p v-if="error">{{ error }}</p>
	</div>
</template>

<script>
// LoginComponent.vue
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Import auth from main.js
import { auth } from '../main.js'; // Assuming 'main.js' initializes Firebase
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import for using with auth

export default {
	name: 'LoginComponent',
	setup() {
		const email = ref('');
		const password = ref('');
		const error = ref('');
		const router = useRouter();

		const navigateToSignUp = () => {
			router.push('/signIn');
		};
		const login = async () => {
			try {
				await signInWithEmailAndPassword(auth, email.value, password.value);
				localStorage.setItem('isAuthenticated', 'true');
				// Ensure that the isAuthenticated state is updated before redirecting
				await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for the auth state to update
				router.push('/home');
			} catch (err) {
				error.value = err.message;
			}
		};

		return {
			email,
			password,
			error,
			login,
			navigateToSignUp,
		};
	},
};
</script>

/* LoginComponent.vue and SignInComponent.vue */
<style scoped>
.login-container,
.signin-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 4px;
	margin: auto;
	max-width: 400px;
}

h2 {
	color: #333;
}

input {
	width: 100%;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ddd;
	border-radius: 4px;
}

button {
	width: 100%;
	padding: 10px 0;
	border: none;
	border-radius: 4px;
	background-color: #4caf50;
	color: white;
	cursor: pointer;
	margin-top: 5px;
}

button:hover {
	background-color: #45a049;
}

p {
	color: red;
	margin-top: 10px;
}
</style>
