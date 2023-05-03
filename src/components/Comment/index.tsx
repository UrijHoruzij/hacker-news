import React, { useEffect, useState } from 'react';
import { Card } from '@mui/material';
import { BASE_API_URL } from '../../utils';

interface CommentProps {
	id: number;
}
interface IComment {
	by: string;
	id: number;
	kids?: number[];
	parent: number;
	text: string;
	time: number;
	type: string;
}
const Comment = (props: CommentProps): JSX.Element => {
	const { id } = props;
	const [comment, setComment] = useState<IComment | null>(null);
	const [comments, setComments] = useState<IComment[] | []>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const handleClick = () => {
		if (comment && comment.kids && comments.length === 0) {
			comment.kids.map(async (item: number) => {
				const res = await fetch(`${BASE_API_URL}/item/${item}.json`);
				const result = await res.json();
				setComments((prev) => [...prev, result]);
			});
		}
	};
	const fetchData = async () => {
		try {
			setIsLoading(true);
			const res = await fetch(`${BASE_API_URL}/item/${id}.json`);
			const result = await res.json();
			setComment(result);
		} catch (err) {
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);
	return (
		<Card>
			{isLoading ? (
				<div>Загрузка</div>
			) : (
				<>
					{comment && (
						<div onClick={handleClick}>
							{comment.by}
							{new Date(comment.time * 1000).toLocaleDateString('en-US', {
								hour: 'numeric',
								minute: 'numeric',
							})}
							{comment.text}
							{comments.length > 0 && comments.map((item) => <Comment key={item.id} id={item.id} />)}
						</div>
					)}
				</>
			)}
		</Card>
	);
};

export default Comment;
