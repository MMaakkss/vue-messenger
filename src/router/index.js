import { createMemoryHistory, createRouter as _createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const getCurrentUser = () => {
	return new Promise((resolve, reject) => {
		const removeListner = onAuthStateChanged(
			getAuth(),
			(user) => {
				removeListner();
				resolve(user);
			},
			reject
		);
	});
};

const isLoggedIn = async (to, from, next) => {
	if (await getCurrentUser()) {
		next();
	} else {
		next({ name: "login" });
	}
};

const routes = [
	{
		path: "/",
		name: "home",
		component: () => import("@/views/ChatList.vue"),
		beforeEnter: [isLoggedIn],
	},
	{
		path: "/chat/:id",
		name: "chat",
		component: () => import("@/views/Chat.vue"),
		beforeEnter: [isLoggedIn],
	},
	{
		path: "/register",
		name: "register",
		component: () => import("@/views/Register.vue"),
	},
	{
		path: "/login",
		name: "login",
		component: () => import("@/views/Login.vue"),
	},
	{
		path: "/:pathMatch(.*)*",
		name: "NotFound",
		component: () => import("@/views/NotFound.vue"),
	},
];

export const createRouter = () =>
	_createRouter({
		history: import.meta.env.SSR ? createMemoryHistory("/") : createWebHistory("/"),
		routes,
	});

// export default router;
