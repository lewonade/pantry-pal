<template>
	<div class="signin-container">
		<h2>Sign Up</h2>
		<input v-model="email" type="email" placeholder="Email" />
		<input v-model="password" type="password" placeholder="Password" />
		<input
			v-model="passwordConfirm"
			type="password"
			placeholder="Confirm Password"
		/>
		<button @click="signUp">Sign Up</button>
		<button @click="navigateToLogin">Login Instead</button>

		<p v-if="error">{{ error }}</p>
	</div>
</template>

<script>
import { ref } from 'vue';
// eslint-disable-next-line no-unused-vars
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default {
	name: 'SignInComponent',
	setup() {
		const email = ref('');
		const password = ref('');
		const passwordConfirm = ref('');
		const error = ref('');
		const auth = getAuth();

		const router = useRouter();
		const navigateToLogin = () => {
			router.push('/login');
		};

		const signUp = async () => {
			if (password.value !== passwordConfirm.value) {
				error.value = 'Passwords do not match.'; // Check if passwords match
				return; // Stop the sign-up process if they don't
			}
			try {
				await createUserWithEmailAndPassword(auth, email.value, password.value);
				router.push('/');
			} catch (err) {
				error.value = err.message;
			}
		};

		return {
			email,
			password,
			error,
			passwordConfirm,
			signUp,
			navigateToLogin,
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
