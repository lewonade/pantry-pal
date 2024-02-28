import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import LoginComponent from '../components/LoginComponent.vue';
import SignIn from '../components/SignInComponent.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

let isAuthenticated = false;

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
	isAuthenticated = !!user;
});

const routes = [
	{ path: '/', component: LoginComponent },

	{
		path: '/login',
		component: LoginComponent,
	},
	{ path: '/signIn', component: SignIn },
	{
		path: '/home',
		component: HomePage,
		meta: { requiresAuth: true },
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

	if (requiresAuth && !isAuthenticated) {
		next('/');
	} else if (!requiresAuth && isAuthenticated) {
		next('/home');
	} else {
		next();
	}
});

export default router;
