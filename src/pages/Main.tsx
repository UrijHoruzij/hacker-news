import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rating, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { countComments, BASE_API_URL } from '../utils';
interface INews {
	by: string;
	descendants: number;
	id: number;
	kids?: number[];
	score: number;
	time: number;
	title: string;
	type: string;
	url: string;
	comments: number;
}

const Main = (): JSX.Element => {
	const [news, setNews] = useState<INews[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchData = async () => {
		try {
			const newsTemp = new Array<INews>();
			const res = await fetch(`${BASE_API_URL}/newstories.json`);
			const result = await res.json();
			for (let i = 85; i < 100; i++) {
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
		<div>
			{isLoading ? (
				<div>Загрузка</div>
			) : (
				<>
					<Button startIcon={<RefreshIcon fontSize="small" />} variant="contained" onClick={handleClick}>
						Обновить
					</Button>
					{news.map((item) => (
						<li key={item.id}>
							{item.title}
							<Rating defaultValue={item.score} precision={0.5} readOnly />
							{item.by}
							{new Date(item.time * 1000).toLocaleDateString('en-US', {
								hour: 'numeric',
								minute: 'numeric',
							})}
							{item.comments}

							<Link to={`/${item.id}`}>{item.title}</Link>
						</li>
					))}
				</>
			)}
		</div>
	);
};

export default Main;
