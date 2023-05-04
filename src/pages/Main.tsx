import React, { useEffect, useState } from 'react';
import { Button, Container, CircularProgress, Grid, Typography, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { countComments, BASE_API_URL } from '../utils';
import { CardNews } from '../components';
import { INews } from '../@types.news';

const Main = (): JSX.Element => {
	const [news, setNews] = useState<INews[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchData = async () => {
		try {
			const newsTemp = new Array<INews>();
			const res = await fetch(`${BASE_API_URL}/newstories.json`);
			const result = await res.json();
			for (let i = 0; i < 100; i++) {
				const resNews = await fetch(`${BASE_API_URL}/item/${result[i]}.json`);
				const resultNews = await resNews.json();
				if (resultNews.kids) {
					resultNews.comments = await countComments(resultNews.kids);
				}
				newsTemp.push(resultNews);
			}
			newsTemp.sort((a, b): any => {
				return b.time - a.time;
			});
			setNews(newsTemp);
		} catch (err) {
		} finally {
			setIsLoading(false);
		}
	};
	const handleClick = () => {
		setIsLoading(true);
		fetchData();
	};
	useEffect(() => {
		setIsLoading(true);
		fetchData();
		const timer = setTimeout(() => {
			fetchData();
		}, 60 * 1000);
		return () => clearTimeout(timer);
	}, []);
	return (
		<Container maxWidth="lg">
			<Grid container spacing={2}>
				<Grid item xs={10}>
					<Typography variant="h3">News</Typography>
				</Grid>
				<Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Button startIcon={<RefreshIcon fontSize="small" />} variant="contained" onClick={handleClick}>
						Update
					</Button>
				</Grid>
				<Grid item xs={12}>
					{isLoading ? (
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								height: 300,
							}}>
							<CircularProgress />
						</Box>
					) : (
						<Grid container sx={{ maxWidth: '100%' }} spacing={2}>
							{news.map((item) => (
								<Grid item xs={12} key={item.id}>
									<CardNews
										url={item.id}
										time={item.time}
										title={item.title}
										comments={item.comments}
										rating={item.score}
										author={item.by}
									/>
								</Grid>
							))}
						</Grid>
					)}
				</Grid>
			</Grid>
		</Container>
	);
};

export default Main;
