// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from './Loading';
import Moment from 'react-moment';
import ColorThief from 'colorthief';
const tinycolor = require('tinycolor2');

function Podcast({ match }) {
	// eslint-disable-next-line
	const [imgRef, setImgRef] = useState(React.createRef());
	const [imgLoadError, setimgLoadError] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);

	const PODCAST_QUERY = gql`
	query {
		podcast(id: ${match.params.id}) {
			id
			title
			description
			rssUrl
			webUrl
			imageUrl
			premiumPodcast
			lastUpdated
			addedByUser
			ignoreKeywords
			episodes {
				id
				title
				publishedDate
				description
				audioUrl
				duration
				transcript
				transcriptAddedDate
				transcriptAddedByUserId
				episodeAddedByUserId
			}
		}
	}
`;

	return (
		<>
			{/* {!pageLoaded && <Loading />} */}
			<Loading />
			{pageLoaded
				? (document.getElementById('loadingContainer').style.opacity = '0')
				: ''}
			{pageLoaded
				? (document.getElementById('loadingContainer').style.display = 'none')
				: null}

			<Query query={PODCAST_QUERY}>
				{({ loading, error, data }) => {
					if (loading) return <div>Fetching..</div>;
					if (error) return <div>Error!</div>;
					return (
						<div className='outerContainer' id='outerDiv'>
							<div id='podcastInfo' key={data.podcast.title}>
								<div id='podcastInfoTextContainer'>
									<div className='podcastInfoText'>
										<h1 className='podcastName'>{data.podcast.title}</h1>
										<p className='podcastDescription'>
											{data.podcast.description}
										</p>
										<a
											className='underlineLink podcastLink'
											href={data.podcast.webUrl}
										>
											Link
										</a>
										{data.podcast.lastUpdated && (
											<p className='sansserif podcastLastUpdated'>
												Updated{' '}
												<Moment
													className='time'
													parse='YYYY-MM-DD HH:mm:ss'
													format='M/D/YY'
												>
													{data.podcast.lastUpdated}
												</Moment>
											</p>
										)}
										{data.podcast.ignoreKeywords && (
											<p className='sansserif podcastIgnoring'>
												Ignoring episodes with "{data.podcast.ignoreKeywords}"
												in the title.
											</p>
										)}
									</div>
								</div>

								<img
									id='podcastMainImage'
									crossOrigin={'anonymous'}
									ref={imgRef}
									src={
										'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=' +
										data.podcast.imageUrl
									}
									alt={`Cover art for ${data.podcast.title}`}
									className='podcastMainImage'
									onLoad={() => {
										if (!imgLoadError) {
											const colorThief = new ColorThief();
											const img = imgRef.current;
											const result = colorThief.getColor(img, 25);
											let color = `linear-gradient(225deg, rgba(${result[0]}, ${
												result[1]
											}, ${result[2]}, 0.5), rgba(${result[0]}, ${result[1]}, ${
												result[2]
											}, 0.9))`;
											if (tinycolor(color).isDark()) {
												color = `linear-gradient(225deg, rgba(${result[0]}, ${
													result[1]
												}, ${result[2]}, 0.2), rgba(${result[0]}, ${
													result[1]
												}, ${result[2]}, 0.4))`;
											}
											document.getElementById(
												'podcastInfoTextContainer'
											).style.background = color;
											setPageLoaded(true);
										}
									}}
									onError={() => {
										document
											.getElementById('podcastMainImage')
											.removeAttribute('crossOrigin');
										document.getElementById('podcastMainImage').src =
											data.podcast.imageUrl;
										setimgLoadError(true);
										setPageLoaded(true);
									}}
								/>
							</div>
							<div className='episodesContainer'>
								<h2>Episodes</h2>
								<table className='episodeTable'>
									{data.podcast.episodes
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
											return data.podcast.ignoreKeywords ? (
												episode.title
													.toLowerCase()
													.includes(
														data.podcast.ignoreKeywords.toLowerCase()
													) ? null : ( // console.log(`not displaying ${episode.title}`)
													<tr>
														<Link to={`/episode/${episode.id}`}>
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
												<div key={episode.id} className='episodeDiv'>
													<Link to={`/episode/${episode.id}`}>
														<div>
															<p className='sansserif'>
																<Moment
																	parse='YYYY-MM-DD HH:mm:ss'
																	format='M/D/YY'
																	className='sansserif'
																>
																	{episode.publishedDate}
																</Moment>{' '}
																- {episode.title}
															</p>
														</div>
													</Link>
												</div>
											);
										})}
								</table>
							</div>
						</div>
					);
				}}
			</Query>
		</>
	);
}
export default Podcast;
