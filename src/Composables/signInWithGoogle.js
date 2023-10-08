import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const signWithGoogle = async () => {
	const provider = new GoogleAuthProvider();

	const response = await signInWithPopup(getAuth(), provider)
		.then(() => {
			return { success: true }
		})
		.catch((error) => {
			console.error(error);
			return { success: false }
		});

	return response
};