import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { countComments, BASE_API_URL } from '../utils';
import { Comment } from '../components';
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
const News = () => {
	const [news, setNews] = useState<INews | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [update, setUpdate] = useState<boolean>(false);
	let { newsId } = useParams();
	const fetchData = async () => {
		try {
			setIsLoading(true);
			const res = await fetch(`${BASE_API_URL}/item/${newsId}.json`);
			const result = await res.json();
			if (result.kids) {
				result.comments = await countComments(result.kids);
			}
			setNews(result);
		} catch (err) {
		} finally {
			setIsLoading(false);
			setUpdate(false);
		}
	};
	const handleClick = () => {
		setUpdate(true);
	};
	useEffect(() => {
		fetchData();
	}, [update]);
	return (
		<div>
			{isLoading ? (
				<div>Загрузка</div>
			) : (
				<>
					{news ? (
						<div>
							{news.title}
							<Link to={news.url}>{news.url}</Link>
							{news.by}
							{news.comments}
							{new Date(news.time * 1000).toLocaleDateString('en-US', {
								hour: 'numeric',
								minute: 'numeric',
							})}
							<Button startIcon={<RefreshIcon fontSize="small" />} variant="contained" onClick={handleClick}>
								Обновить
							</Button>
							{news.kids ? news.kids.map((comment) => <Comment key={comment} id={comment} />) : null}
						</div>
					) : null}
				</>
			)}
			<Link to={'/'}>Назад</Link>
		</div>
	);
};

export default News;
