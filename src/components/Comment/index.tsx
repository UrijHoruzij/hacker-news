import React, { useEffect, useState } from 'react';
import { Card, CardActionArea, CardContent, Typography, Box, Button, CircularProgress } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import parse from 'html-react-parser';
import { BASE_API_URL } from '../../utils';
import { IComment } from '../../@types.news';

interface CommentProps {
	id: number;
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
		<Card sx={{ marginTop: '8px', maxWidth: '100%' }}>
			<CardActionArea>
				<CardContent>
					{isLoading ? (
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<CircularProgress />
						</Box>
					) : (
						<>
							{comment && (
								<div>
									<Box
										sx={{
											marginTop: '8px',
											marginBottom: '16px',
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}>
										<Typography variant="h6" component="h6">
											{comment.by}
										</Typography>
										<Typography variant="subtitle2">
											{new Date(comment.time * 1000).toLocaleDateString('en-US', {
												hour: 'numeric',
												minute: 'numeric',
											})}
										</Typography>
									</Box>
									{comment.text && (
										<Typography sx={{ marginTop: '16px', marginBottom: '12px' }} variant="body2" color="text.secondary">
											{parse(comment.text)}
										</Typography>
									)}
									{comment.kids && comments.length === 0 && (
										<Button
											startIcon={<ArrowDownwardIcon fontSize="small" />}
											variant="contained"
											onClick={handleClick}>
											Answers
										</Button>
									)}
									{comments.length > 0 && comments.map((item) => <Comment key={item.id} id={item.id} />)}
								</div>
							)}
						</>
					)}
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default Comment;
