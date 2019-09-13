import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const PODCASTS_QUERY = gql`
	query {
		podcasts {
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
		}
	}
`;

class Podcasts extends Component {
	render() {
		return (
			<Query query={PODCASTS_QUERY}>
				{({ loading, error, data }) => {
					if (loading) return <div>Fetching..</div>;
					if (error) return <div>Error!</div>;
					return (
						<div className='outerContainer'>
							<h1>Read and Search Podcast Transcripts</h1>
							{data.podcasts.map(podcast => {
								return (
									<div key={podcast.id}>
										<p>Podcast ID: {podcast.id}</p>
										<p>{podcast.title}</p>
										<p>{podcast.description}</p>
										<p>RSS URL: {podcast.rssUrl}</p>
										<p>Web URL: {podcast.webUrl}</p>
										<img
											src={podcast.imageUrl}
											alt={`Cover art for ${podcast.title}`}
											className='podcastImage'
											width='200px'
										/>
										<p>Premium Podcast: {podcast.premiumPodcast}</p>
										<p>Last Updated: {podcast.lastUpdated}</p>
										<p>Added by user: {podcast.addedByUser}</p>
										<p>Ignore Keywords: {podcast.ignoreKeywords}</p>
									</div>
								);
							})}
						</div>
					);
				}}
			</Query>
		);
	}
}
export default Podcasts;
