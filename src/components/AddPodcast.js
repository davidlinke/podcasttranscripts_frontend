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

class AddPodcast extends Component {
	render() {
		return <div>Add a Podcast</div>;
	}
}
export default AddPodcast;
