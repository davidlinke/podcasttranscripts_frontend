import React from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Moment from 'react-moment';

function EpisodeTable(props) {
	return (
		<div className='episodesContainer'>
			{props.episodes.length === 0 && (
				<div className='centered'>
					<p>No Episodes Found</p>
				</div>
			)}
			{props.episodes.length > 0 && (
				<>
					<h2>Episodes</h2>
					<div className='episodeTable'>
						<div>
							{props.episodes
								.sort(function(a, b) {
									const c = Number(
										a.publishedDate.substr(0, 10).replace(/-/g, '')
									);
									const d = Number(
										b.publishedDate.substr(0, 10).replace(/-/g, '')
									);
									if (c > d) {
										return -1;
									}
									if (c < d) {
										return 1;
									}
									return 0;
								})
								.map(episode => {
									return props.podcast.ignoreKeywords ? (
										episode.title
											.toLowerCase()
											.includes(
												props.podcast.ignoreKeywords.toLowerCase()
											) ? null : (
											<div
												className='tableRow'
												key={episode.title + episode.id}
											>
												<Link to={`/episode/${props.podcast.id}/${episode.id}`}>
													<div className='tableDate'>
														<Moment
															parse='YYYY-MM-DD HH:mm:ss'
															format='M/D/YY'
															className='tableText'
														>
															{episode.publishedDate}
														</Moment>
													</div>
													<div className='tableText'>{episode.title}</div>
												</Link>
											</div>
										)
									) : (
										<div key={episode.title} className='tableRow'>
											<Link to={`/episode/${props.podcast.id}/${episode.id}`}>
												<div className='tableDate'>
													<Moment
														parse='YYYY-MM-DD HH:mm:ss'
														format='M/D/YY'
														className='tableText'
													>
														{episode.publishedDate}
													</Moment>
												</div>
												<div className='tableText'>{episode.title}</div>
											</Link>
										</div>
									);
								})}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
export default EpisodeTable;
