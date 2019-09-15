import React from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Podcasts from './components/Podcasts';
import Podcast from './components/Podcast';
import Episode from './components/Episode';
import Footer from './components/Footer';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

function App() {
	return (
		<Route
			render={({ location }) => (
				<div className='outerContainer'>
					<div className='navContainer'>
						<Link to='/' className='navLogo'>
							pd
						</Link>
						<div className='linksContainer'>
							<Link to='/podcast'>
								<div className='navButton navLink noBackground'>
									Add Podcast
								</div>
							</Link>
							<Link to='/podcast'>
								<div className='navButton navLink noBackground'>Sign In</div>
							</Link>
							<Link to='/podcast'>
								<button className='navButton'>Create Account</button>
							</Link>
						</div>
					</div>
					<TransitionGroup>
						<CSSTransition key={location} timeout={300} classNames='fade'>
							<Switch>
								<Route exact path='/' component={Podcasts} />
								<Route path='/podcast/:id' component={Podcast} />
								<Route path='/episode/:id' component={Episode} />
								{/* <Route path='/episode/:id/edit' component={} />
								<Route path='/episode/:id/addtranscript' component={} />
								<Route path='/createaccount' component={} /> */}
							</Switch>
						</CSSTransition>
					</TransitionGroup>
					<Footer />
				</div>
			)}
		/>
	);
}

export default App;
