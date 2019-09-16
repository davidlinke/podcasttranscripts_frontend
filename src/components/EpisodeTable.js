import React from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Moment from 'react-moment';

function EpisodeTable(props) {
	return (
		<div className='episodesContainer'>
			<h2>Episodes</h2>
			<table className='episodeTable'>
				<tbody>
					{props.podcast.episodes
						.sort(function(a, b) {
							const c = Number(a.publishedDate.substr(0, 10).replace(/-/g, ''));
							const d = Number(b.publishedDate.substr(0, 10).replace(/-/g, ''));
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
									<tr key={episode.title + episode.id}>
										<Link to={`/episode/${props.podcast.id}/${episode.id}`}>
											<td className='tableDate'>
												<Moment
													parse='YYYY-MM-DD HH:mm:ss'
													format='M/D/YY'
													className='tableText'
												>
													{episode.publishedDate}
												</Moment>
											</td>
											<td className='tableText'>{episode.title}</td>
										</Link>
									</tr>
								)
							) : (
								<tr key={episode.title}>
									<Link to={`/episode/${props.podcast.id}/${episode.id}`}>
										<td className='tableDate'>
											<Moment
												parse='YYYY-MM-DD HH:mm:ss'
												format='M/D/YY'
												className='tableText'
											>
												{episode.publishedDate}
											</Moment>
										</td>
										<td className='tableText'>{episode.title}</td>
									</Link>
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
}
export default EpisodeTable;
