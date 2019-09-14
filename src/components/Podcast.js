// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import ColorThief from 'colorthief';
const tinycolor = require('tinycolor2');

function secondsToString(sec) {
	let seconds = sec;
	const hours = Math.floor(seconds / (60 * 60));
	seconds -= hours * (60 * 60);
	const minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;
	return hours + 'h, ' + minutes + 'm and ' + seconds + 's';
}

function Podcast({ match }) {
	// eslint-disable-next-line
	const [imgRef, setImgRef] = useState(React.createRef());
	// const [imgColor, setImgColor] = useState('rgb(100,100,100)');
	const [imgLoadError, setimgLoadError] = useState(false);

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
									<a className='underlineLink' href={data.podcast.webUrl}>
										Link
									</a>
									{data.podcast.lastUpdated && (
										<p className='sansserif podcastLastUpdated'>
											Episodes Updated{' '}
											<Moment
												className='time'
												parse='YYYY-MM-DD HH:mm:ss'
												format='M/D/YY'
											>
												{data.podcast.lastUpdated}
											</Moment>
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
										// console.log(color);
										// console.log('Is Light? ' + tinycolor(color).isLight());
										// console.log('Is Dark? ' + tinycolor(color).isDark());
										if (tinycolor(color).isDark()) {
											color = `linear-gradient(225deg, rgba(${result[0]}, ${
												result[1]
											}, ${result[2]}, 0.2), rgba(${result[0]}, ${result[1]}, ${
												result[2]
											}, 0.4))`;
										}
										// setImgColor(color);
										document.getElementById(
											'podcastInfoTextContainer'
										).style.background = color;
									}
								}}
								onError={() => {
									document
										.getElementById('podcastMainImage')
										.removeAttribute('crossOrigin');
									document.getElementById('podcastMainImage').src =
										data.podcast.imageUrl;
									setimgLoadError(true);
								}}
							/>
						</div>
						<div className='episodesContainer'>
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
									return (
										<div key={episode.id} className='episodeDiv'>
											{/* <Link to={`/episode/${episode.id}`}> */}
											<div>
												<p>{episode.publishedDate}</p>
												<p>
													<Moment
														className='time'
														parse='YYYY-MM-DD HH:mm:ss'
														format='M/D/YY'
													>
														{episode.publishedDate}
													</Moment>
												</p>
												<p>{episode.title}</p>
												{/* <p>Episode Duration: {episode.duration}</p>
												<p>{secondsToString(episode.duration)}</p> */}
												{/* <Moment format='HH:mm'>{episode.duration}</Moment> */}
											</div>
											{/* </Link> */}
										</div>
									);
								})}
						</div>
					</div>
				);
			}}
		</Query>
	);
}
export default Podcast;
