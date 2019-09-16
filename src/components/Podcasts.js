import React, { Component } from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const PODCASTS_QUERY = gql`
	query {
		podcasts {
			id
			title
			imageUrl
			addedByUser
		}
	}
`;

function Podcasts() {
	return (
		<Query query={PODCASTS_QUERY}>
			{({ loading, error, data }) => {
				if (loading) return <div>Loading podcasts.</div>;
				if (error) return <div>Error!</div>;
				return (
					<div className='homeContainer'>
						<h2 className='homeTitle'>PodDialogue</h2>
						<h1 className='homeSubtitle'>
							Read &amp; Search Podcast Transcripts.
						</h1>
						<div className='podcastsContainer'>
							{data.podcasts
								.sort(function(a, b) {
									if (a.title < b.title) {
										return -1;
									}
									if (a.title > b.title) {
										return 1;
									}
									return 0;
								})
								.map(podcast => {
									return (
										<div key={podcast.id} className='podcastDiv'>
											<Link to={`/podcast/${podcast.id}`}>
												<div
													className='podcastImage'
													style={{
														backgroundImage: podcast.imageUrl
															? `url(${podcast.imageUrl})`
															: 'none',
														backgroundSize: 'cover',
														backgroundRepeat: 'no-repeat',
														backgroundPosition: '50% 50%'
													}}
												></div>
											</Link>
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

export default Podcasts;
