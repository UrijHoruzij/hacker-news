export const BASE_API_URL = 'https://hacker-news.firebaseio.com/v0';

export const countComments = async (root: number[]) => {
	let queue = [...root];
	let result = [];
	let node;
	while (queue.length) {
		node = queue.shift();
		result.push(node);
		const res = await fetch(`${BASE_API_URL}/item/${node}.json`);
		const comment = await res.json();
		if (comment.kids) {
			queue = [...queue, ...comment.kids];
		}
	}
	return result.length;
};
