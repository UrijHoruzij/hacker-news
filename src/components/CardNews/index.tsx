import React from 'react';
import { CardActionArea } from '@mui/material';
import { Card, CardContent, Typography, Rating, Box } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { useNavigate } from 'react-router-dom';

interface CardNewsProps {
	url: number;
	author: string;
	rating: number;
	title: string;
	time: number;
	comments: number;
}

const CardNews = (props: CardNewsProps) => {
	const { url, title, author, comments, rating, time } = props;
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/${url}`);
	};
	return (
		<Card onClick={handleClick} variant="outlined" sx={{ maxWidth: '100%' }}>
			<CardActionArea>
				<CardContent>
					<Typography sx={{ marginTop: '8px', marginBottom: '16px' }} variant="h5" component="h5">
						{title}
					</Typography>
					<Rating defaultValue={rating} precision={0.5} readOnly />
					<Typography variant="h6" sx={{ marginTop: '12px' }} component="h6">
						Author: {author}
					</Typography>
					<Box sx={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Typography variant="subtitle1" sx={{ marginTop: '12px' }}>
							{new Date(time * 1000).toLocaleDateString('en-US', {
								hour: 'numeric',
								minute: 'numeric',
							})}
						</Typography>
						{comments > 0 && (
							<Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
								<CommentIcon fontSize="small" />
								<Typography variant="h6">{comments}</Typography>
							</Box>
						)}
					</Box>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default CardNews;
