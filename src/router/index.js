import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const routes = [
	{
		path: "/",
		name: "home",
		component: () => import("@/views/ChatList.vue"),
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: "/chat/:id",
		name: "chat",
		component: () => import("@/views/Chat.vue"),
		meta: {
			requiresAuth: true,
		},
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

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior() {
		return { top: 0 };
	},
});

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

router.beforeEach(async (to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (await getCurrentUser()) {
			next();
		} else {
			next({ name: "login" });
		}
	} else {
		next();
	}
});

export default router;
