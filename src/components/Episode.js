import React, { useState } from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import AddTranscript from './AddTranscript';

function Episode({ match }) {
	const [showAddTranscript, setShowAddTranscript] = useState(false);
	const [refetchAll, setRefetchAll] = useState(false);

	const resetRefresh = () => {
		setRefetchAll(false);
	};

	const QUERY = gql`
	query {
		podcast(id: ${match.params.pod_id}) {
			id
			title
			description
			webUrl
			imageUrl
			premiumPodcast
			lastUpdated
			addedByUser
		}
		episode(id: ${match.params.ep_id}) {
			id
			podcastId
			title
			publishedDate
     	 	description
      		audioUrl
			duration
			transcript
			transcriptAddedDate
			transcriptAddedByUserId
		}
	}`;

	return (
		<>
			<Query query={QUERY}>
				{({ loading, error, data, refetch }) => {
					if (loading) return <div>Getting episode...</div>;
					if (error) return <div>Error getting episode!</div>;
					return (
						<>
							{refetchAll && refetch() && resetRefresh()}
							<div className='outerContainer' id='outerDiv'>
								<div id='episodeInfo' key={data.episode.title}>
									<img
										id='episodeMainImage'
										src={data.podcast.imageUrl}
										alt={`Cover art for ${data.podcast.title}`}
										className='podcastMainImage'
									/>
									<div id='episodeInfoTextContainer'>
										<div className='episodeInfoText'>
											<Link to={`/podcast/${data.podcast.id}`}>
												<h2 className='underlineLink'>{data.podcast.title}</h2>
											</Link>
											<h1>{data.episode.title}</h1>
											<Moment
												parse='YYYY-MM-DD HH:mm:ss'
												format='M/D/YY'
												className='publishedDate'
											>
												{data.episode.publishedDate}
											</Moment>
											<p className='episodeDescription'>
												{data.episode.description}
											</p>
											{/* Hide Episode Link If Premium Podcast */}
											{!data.podcast.premiumPodcast && (
												<a
													className='underlineLink episodeLink'
													href={data.episode.audioUrl}
													target='_blank'
													rel='noopener noreferrer'
												>
													Download Episode
												</a>
											)}
											{!data.episode.transcript && !showAddTranscript && (
												<button
													className='smallButton'
													onClick={() => setShowAddTranscript(true)}
												>
													Add Transcript
												</button>
											)}
											{!data.episode.transcript && showAddTranscript && (
												<button
													className='smallButton pinkButton'
													onClick={() => setShowAddTranscript(false)}
												>
													Cancel Add Transcript
												</button>
											)}
											{/* {data.episode.transcript && (
												<button className='smallButton'>Edit Transcript</button>
											)} */}
										</div>
									</div>
								</div>
								{showAddTranscript && (
									<AddTranscript
										episodeId={data.episode.id}
										setShowAddTranscript={setShowAddTranscript}
										setRefetchAll={setRefetchAll}
									/>
								)}
								{data.episode.transcript && (
									<div className='transcriptContainer'>
										<h2>Transcript</h2>
										<div id='transcriptText'>{data.episode.transcript}</div>
									</div>
								)}
							</div>
						</>
					);
				}}
			</Query>
		</>
	);
}
export default Episode;
