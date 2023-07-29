import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCOPiQBn4TrtaBgkm9V0ppoXcc4_nqP2z8",
	authDomain: "vue-online-chat-adfb8.firebaseapp.com",
	projectId: "vue-online-chat-adfb8",
	storageBucket: "vue-online-chat-adfb8.appspot.com",
	messagingSenderId: "432756065970",
	appId: "1:432756065970:web:599f3fc2194fa98bceabab",
};

getFirestore(initializeApp(firebaseConfig));

createApp(App).use(router).mount("#app");
