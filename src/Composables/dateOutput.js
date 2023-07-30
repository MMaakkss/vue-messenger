export const dateOutput = (date) => {
	const currentDate = new Date();
	const chatDate = new Date(date);

	if (currentDate.toDateString() === chatDate.toDateString()) {
		const minutes = String(chatDate.getMinutes()).length < 2 ? "0" + chatDate.getMinutes() : chatDate.getMinutes();
		return chatDate.getHours() + ":" + minutes;
	} else if (chatDate.getFullYear() === currentDate.getFullYear()) {
		return chatDate.toLocaleString([], {
			month: "numeric", day: "numeric",
			hour: "numeric", minute: "numeric",
		})
	} else {
		return chatDate.toLocaleString([], { timeStyle: "short", dateStyle: "short" } );
	}
};