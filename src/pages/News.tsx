import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Container, Grid, Box, Typography, Link } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import parse from 'html-react-parser';
import { countComments, BASE_API_URL } from '../utils';
import { Comment } from '../components';
import { INews } from '../@types.news';

const News = (): JSX.Element => {
	const [news, setNews] = useState<INews | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
	let { newsId } = useParams();
	const navigate = useNavigate();

	const fetchData = async () => {
		try {
			const res = await fetch(`${BASE_API_URL}/item/${newsId}.json`);
			const result = await res.json();
			if (result.kids) {
				result.comments = await countComments(result.kids);
			}
			setNews(result);
		} catch (err) {
		} finally {
			setIsLoading(false);
		}
	};
	const handleNavigateBack = () => {
		navigate(`/`);
	};
	const handleNavigateUrl = (url: string) => {
		window.location.href = url;
	};
	const handleUpdate = async () => {
		setIsLoadingComments(true);
		await fetchData();
		setIsLoadingComments(false);
	};
	useEffect(() => {
		setIsLoading(true);
		fetchData();
	}, []);
	return (
		<Container maxWidth="lg">
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Button
						startIcon={<KeyboardBackspaceIcon fontSize="small" />}
						variant="contained"
						onClick={handleNavigateBack}>
						Back
					</Button>
				</Grid>
				{isLoading ? (
					<Grid item xs={12}>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								height: 300,
							}}>
							<CircularProgress />
						</Box>
					</Grid>
				) : (
					<Grid item xs={12}>
						{news ? (
							<>
								<Typography variant="h3" sx={{ marginBottom: '12px' }}>
									{news.title}
								</Typography>
								<Link
									sx={{
										'&:hover': {
											cursor: 'pointer',
										},
									}}
									component="button"
									variant="body2"
									onClick={() => handleNavigateUrl(news.url)}>
									{news.url}
								</Link>
								{news.text && (
									<Typography sx={{ marginBottom: '16px' }} variant="body2" color="text.secondary">
										{parse(news.text)}
									</Typography>
								)}
								<Box sx={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<Typography variant="h5">Author: {news.by}</Typography>
									<Typography sx={{ marginTop: '12px' }} variant="h6">
										{new Date(news.time * 1000).toLocaleDateString('en-US', {
											hour: 'numeric',
											minute: 'numeric',
										})}
									</Typography>
								</Box>
								<Box sx={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<Typography variant="h6">Comments {news.comments > 0 ? news.comments : 0}</Typography>
									<Button startIcon={<RefreshIcon fontSize="small" />} variant="contained" onClick={handleUpdate}>
										Update
									</Button>
								</Box>
								{isLoadingComments ? (
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											height: 150,
										}}>
										<CircularProgress />
									</Box>
								) : (
									<Grid container sx={{ maxWidth: '100%', marginTop: '16px' }} spacing={2}>
										{news.kids
											? news.kids.map((comment) => (
													<Grid item xs={12}>
														<Comment key={comment} id={comment} />
													</Grid>
											  ))
											: null}
									</Grid>
								)}
							</>
						) : null}
					</Grid>
				)}
			</Grid>
		</Container>
	);
};

export default News;
