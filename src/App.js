import React from 'react';
import Podcasts from './components/Podcasts';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

function App() {
	return (
		<div>
			<Navigation />
			<Podcasts />
			<Footer />
		</div>
	);
}

export default App;
