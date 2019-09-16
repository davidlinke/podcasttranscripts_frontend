import React, { useState } from 'react';
// eslint-disable-next-line
import {
	BrowserRouter as Router,
	Route,
	Link,
	Switch,
	Redirect,
	withRouter
} from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from './Loading';
import Moment from 'react-moment';
import 'moment-timezone';
import ColorThief from 'colorthief';
import { CSSTransition } from 'react-transition-group';
import { useMutation } from '@apollo/react-hooks';

import EpisodeTable from './EpisodeTable';

const tinycolor = require('tinycolor2');
Moment.globalLocal = true;

function Podcast({ match }) {
	const [imgRef] = useState(React.createRef());
	const [imgLoadError, setimgLoadError] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [refetchAll, setRefetchAll] = useState(false);
	const [refreshAll, setRefreshAll] = useState(false);
	const [redirectToHome, setRedirectToHome] = useState(false);

	const PODCAST_QUERY = gql`
	query {
		podcast(id: ${match.params.id}) {
			id
			title
			description
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
				transcriptAddedDate
				transcriptAddedByUserId
				episodeAddedByUserId
			}
		}
	}
`;

	const REFRESH_QUERY = gql`
	mutation {
		updatePodcastEpisodes(input: {
			podcastId: ${match.params.id}
		}) {
			podcast {
				id
			}
			errors
		}
	}
	`;

	const DELETE_QUERY = gql`
	mutation {
		removePodcast(input: {
			podcastId: ${match.params.id}
		}) {
			removed
			podcast {
				id
			}
			errors
		}
	}
	`;

	const [refreshState] = useMutation(REFRESH_QUERY, {
		onCompleted({ refreshState }) {
			setRefetchAll(true);
		}
	});

	const resetRefresh = () => {
		setRefetchAll(false);
		setRefreshAll(false);
	};

	const [removePodcast] = useMutation(DELETE_QUERY, {
		onCompleted({ removePodcast }) {
			console.log('removed');
			setRedirectToHome(true);
		}
	});

	const renderRedirect = () => {
		if (redirectToHome) {
			return <Redirect to='/' />;
		}
	};

	return (
		<>
			{renderRedirect()}
			<CSSTransition
				in={!pageLoaded}
				timeout={750}
				classNames='fade'
				unmountOnExit
			>
				<Loading />
			</CSSTransition>

			<Query query={PODCAST_QUERY}>
				{({ loading, error, data, refetch }) => {
					if (loading) return <div>Getting podcast...</div>;
					if (error) return <div>Error getting podcast!</div>;
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
											target='_blank'
											rel='noopener noreferrer'
										>
											Link
										</a>
										{/* Empty div for block spacing */}
										<div></div>
										{data.podcast.lastUpdated && (
											<p className='sansserif podcastLastUpdated'>
												Updated{' '}
												<Moment
													className='time'
													parse='YYYY-MM-DD HH:mm:ss'
													format='M/D/YY h:mma'
													utc
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
										<button
											className='smallButton'
											onClick={() => refreshState() && setRefreshAll(true)}
										>
											Update Episodes
										</button>
										<div className='spacer'></div>
										<button
											className='smallButton pinkButton'
											onClick={() => removePodcast()}
										>
											Delete Podcast
										</button>
										{refetchAll && refetch() && resetRefresh()}
										{refreshAll && (
											<p className='sansserif podcastUpdating'>Updating...</p>
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
											// Only change color if table exists
											data.podcast.episodes.length > 0 &&
												(document.getElementsByClassName(
													'episodeTable'
												)[0].style.background = color);

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
							{data.podcast.episodes.length > 0 && (
								<EpisodeTable podcast={data.podcast} />
							)}
						</div>
					);
				}}
			</Query>
		</>
	);
}
export default Podcast;
