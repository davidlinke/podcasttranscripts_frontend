import React from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Podcasts from './components/Podcasts';
import Podcast from './components/Podcast';
import Episode from './components/Episode';
import AddPodcast from './components/AddPodcast';
import Footer from './components/Footer';
import NotFound from './components/NotFound';

function App() {
	return (
		<div className='outerContainer'>
			<div className='navContainer'>
				<Link to='/' className='navLogo'>
					pd
				</Link>
				<div className='linksContainer'>
					<Link to='/addpodcast'>
						<button className='navButton'>Add Podcast</button>
					</Link>
					{/* <Link to='/podcast'>
						<div className='navButton navLink noBackground'>Sign In</div>
					</Link>
					<Link to='/podcast'>
						<button className='navButton'>Create Account</button>
					</Link> */}
				</div>
			</div>

			<Switch>
				<Route exact path='/' component={Podcasts} />
				<Route path='/podcast/:id' component={Podcast} />
				<Route path='/episode/:pod_id/:ep_id' component={Episode} />
				<Route path='/addpodcast' component={AddPodcast} />
				<Route path='/404' component={NotFound} />
				<Route component={NotFound} />
			</Switch>
			<Footer />
		</div>
	);
}

export default App;
