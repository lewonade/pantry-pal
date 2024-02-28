<template>
	<div class="signin-container">
		<h2>Sign Up</h2>
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

		<input
			v-model="passwordConfirm"
			type="password"
			placeholder="Confirm Password"
			:class="{ 'input-error': passwordConfirmError }"
		/>
		<p v-if="passwordConfirmError" class="error-message">{{
			passwordConfirmError
		}}</p>

		<button @click="signUp" :disabled="isLoading">
			<span v-if="isLoading">Signing Up...</span>
			<span v-else>Sign Up</span>
		</button>
		<button @click="navigateToLogin" :disabled="isLoading"
			>Login Instead</button
		>

		<p v-if="error" class="error-message">{{ error }}</p>
	</div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default {
	name: 'SignInComponent',
	setup() {
		const email = ref('');
		const password = ref('');
		const passwordConfirm = ref('');
		const error = ref('');
		const emailError = ref('');
		const passwordError = ref('');
		const passwordConfirmError = ref('');
		const isLoading = ref(false); // Add this line
		const auth = getAuth();

		const router = useRouter();

		const validateInput = () => {
			emailError.value = '';
			passwordError.value = '';
			passwordConfirmError.value = '';
			let isValid = true;
			if (!email.value) {
				emailError.value = 'Email is required.';
				isValid = false;
			}
			if (!password.value) {
				passwordError.value = 'Password is required.';
				isValid = false;
			}
			if (password.value !== passwordConfirm.value) {
				passwordConfirmError.value = 'Passwords do not match.';
				isValid = false;
			}
			return isValid;
		};

		const navigateToLogin = () => {
			router.push('/login');
		};

		const signUp = async () => {
			if (!validateInput()) return;
			isLoading.value = true; // Enable loading state
			try {
				await createUserWithEmailAndPassword(auth, email.value, password.value);
				router.push('/');
			} catch (err) {
				switch (err.code) {
					case 'auth/email-already-in-use':
						error.value = 'This email is already in use.';
						break;
					case 'auth/invalid-email':
						error.value = 'Invalid email format.';
						break;
					case 'auth/weak-password':
						error.value = 'Password is too weak.';
						break;
					default:
						error.value = 'An error occurred during sign up.';
						break;
				}
			} finally {
				isLoading.value = false; // Disable loading state
			}
		};

		return {
			email,
			password,
			passwordConfirm,
			error,
			emailError,
			passwordError,
			passwordConfirmError,
			isLoading, // Make sure to return this
			signUp,
			navigateToLogin,
		};
	},
};
</script>

/* LoginComponent.vue and SignInComponent.vue */
<style scoped>
.signin-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100px;
	border: 1px solid #ccc;
	border-radius: 4px;
	max-width: 1400px;

	/* New styles to center the container on the screen */
	position: fixed; /* or fixed */
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
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
