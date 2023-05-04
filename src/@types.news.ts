interface IData {
	by: string;
	id: number;
	kids?: number[];
	text?: string;
	time: number;
	type: string;
}
export interface INews extends IData {
	descendants: number;
	score: number;
	title: string;
	url: string;
	comments: number;
}

export interface IComment extends IData {
	parent: number;
}
