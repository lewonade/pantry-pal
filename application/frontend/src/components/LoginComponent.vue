<template>
	<div class="login-container">
		<h2>Login</h2>
		<input
			v-model="email"
			type="email"
			placeholder="Email"
			:class="{ 'input-error': emailError }"
		/>
		<p v-if="emailError" class="error-message">{{ emailError }}</p>

		<input
			v-model="password"
			type="password"
			placeholder="Password"
			:class="{ 'input-error': passwordError }"
		/>
		<p v-if="passwordError" class="error-message">{{ passwordError }}</p>

		<button @click="login" :disabled="isLoading">
			<span v-if="isLoading">Loading...</span>
			<span v-else>Login</span>
		</button>
		<button @click="navigateToSignUp" :disabled="isLoading"
			>Sign Up Instead</button
		>

		<p v-if="error" class="error-message">{{ error }}</p>
	</div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../main.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default {
	name: 'LoginComponent',
	setup() {
		const email = ref('');
		const password = ref('');
		const error = ref('');
		const emailError = ref('');
		const passwordError = ref('');
		const isLoading = ref(false);
		const router = useRouter();

		const validateInput = () => {
			emailError.value = '';
			passwordError.value = '';
			let isValid = true;
			if (!email.value) {
				emailError.value = 'Email is required.';
				isValid = false;
			}
			if (!password.value) {
				passwordError.value = 'Password is required.';
				isValid = false;
			}
			return isValid;
		};

		const navigateToSignUp = () => {
			router.push('/signIn');
		};
		const login = async () => {
			if (!validateInput()) return; // Stop the login process if validation fails
			isLoading.value = true;
			try {
				await signInWithEmailAndPassword(auth, email.value, password.value);
				localStorage.setItem('isAuthenticated', 'true');
				await new Promise((resolve) => setTimeout(resolve, 1000));
				router.push('/home');
			} catch (err) {
				error.value =
					'Failed to log in. Please check your credentials and try again.';
				if (err.code === 'auth/user-not-found') {
					error.value = 'No user found with this email.';
				} else if (err.code === 'auth/wrong-password') {
					error.value = 'Incorrect password. Please try again.';
				}
				// Add more specific error messages based on err.code as needed
			} finally {
				isLoading.value = false;
			}
		};

		return {
			email,
			password,
			error,
			emailError,
			passwordError,
			isLoading,
			login,
			navigateToSignUp,
		};
	},
};
</script>

/* LoginComponent.vue and SignInComponent.vue */
<style scoped>
.login-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100px;
	border: 1px solid #ccc;
	border-radius: 4px;
	max-width: 400px;

	/* New styles to center the container on the screen */
	position: fixed; /* or fixed */
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

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
.input-error {
	border-color: #ff3860; /* Highlight input fields with errors */
}

.error-message {
	color: #ff3860; /* Color for error messages */
	margin-top: 5px;
	font-size: 0.9em;
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
