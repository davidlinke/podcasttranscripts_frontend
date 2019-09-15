import React from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Podcasts from './components/Podcasts';
import Podcast from './components/Podcast';
import Episode from './components/Episode';
import Footer from './components/Footer';

function App() {
	return (
		<div className='outerContainer'>
			<div className='navContainer'>
				<Link to='/' className='navLogo'>
					pd
				</Link>
				<div className='linksContainer'>
					<Link to='/podcast'>
						<div className='navButton navLink noBackground'>Add Podcast</div>
					</Link>
					<Link to='/podcast'>
						<div className='navButton navLink noBackground'>Sign In</div>
					</Link>
					<Link to='/podcast'>
						<button className='navButton'>Create Account</button>
					</Link>
				</div>
			</div>

			<Switch>
				<Route exact path='/' component={Podcasts} />
				<Route path='/podcast/:id' component={Podcast} />
				<Route path='/episode/:pod_id/:ep_id' component={Episode} />
			</Switch>
			<Footer />
		</div>
	);
}

export default App;
