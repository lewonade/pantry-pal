<template>
	<div id="app">
		<HomePage />
	</div>
</template>

<script>
import HomePage from './components/HomePage.vue';

export default {
	name: 'App',
	components: {
		HomePage,
	},
};
</script>

<style>
/* Global styles can remain here or be moved to a separate global CSS file */
@import url('https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap');

* {
	font-family: 'Mulish', sans-serif;
}
</style>
