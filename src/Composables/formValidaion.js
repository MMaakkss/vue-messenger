const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const emailValidation = (email) => {
	if (email === "") return false;

	return !re.test(email.toLowerCase());
};

export const passwordValidation = (password) => {
	if (password === "") return false;

	return password.length < 6;
};
