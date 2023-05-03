import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import News from './pages/News';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Main />} />
				<Route path="/:newsId" element={<News />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
