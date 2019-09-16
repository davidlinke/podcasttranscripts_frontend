import React from 'react';
import useForm from 'react-hook-form';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

const ADD_PODCAST_MUTATION = gql`
	mutation(
		$rssUrl: String!
		$premiumPodcast: Boolean!
		$addedByUser: Int!
		$ignoreKeywords: String!
	) {
		addPodcast(
			input: {
				rssUrl: $rssUrl
				premiumPodcast: $premiumPodcast
				addedByUser: $addedByUser
				ignoreKeywords: $ignoreKeywords
			}
		) {
			podcast {
				id
			}
			errors
		}
	}
`;

function AddPodcast() {
	const { register, handleSubmit, errors, getValues, reset } = useForm();
	const [
		addNewPodcast,
		{ loading: mutationLoading, error: mutationError, data: mutationData }
	] = useMutation(ADD_PODCAST_MUTATION);

	const onSubmit = () => {
		const values = getValues();

		addNewPodcast({
			variables: {
				rssUrl: values.rssUrl,
				premiumPodcast: values.premiumPodcast,
				ignoreKeywords: values.ignoreKeywords,
				addedByUser: 1
			}
		});

		reset({
			rssUrl: '',
			premiumPodcast: false,
			ignoreKeywords: ''
		});
	};

	return (
		<div className='addPodcastContainer'>
			<div className='centered'>
				<h2>Add New Podcast</h2>
			</div>
			<form className='addPodcastForm' onSubmit={handleSubmit(onSubmit)}>
				<label htmlFor='rssUrl'>RSS URL</label>
				<input
					name='rssUrl'
					placeholder='i.e. http://rss.podcast.com/'
					ref={register({
						required: true,
						// eslint-disable-next-line
						pattern: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
					})}
					className='rssUrl textInput'
				/>
				{errors.rssUrl && (
					<p className='formErrorMessage'>Please enter a valid RSS url.</p>
				)}
				<label htmlFor='premiumPodcast' className='inline'>
					Premium podcast?
				</label>
				<input
					type='checkbox'
					name='premiumPodcast'
					ref={register}
					className='premiumPodcast inline'
				/>

				<label htmlFor='ignoreKeywords'>
					Ignore episodes with this in the title
				</label>
				<input
					name='ignoreKeywords'
					placeholder='i.e. Platinum Feed'
					ref={register}
					className='ignoreKeywords textInput'
				/>

				<input type='submit' value='Add Podcast' className='inputCentered' />
				{mutationLoading && (
					<p className='addingPodcastState'>Adding Podcast...</p>
				)}
				{mutationError && (
					<p className='errorCreatingPodcast'>
						Error, please try again with a different URL or contact us.
					</p>
				)}
				{mutationData && (
					<div className='centered'>
						<Link
							className='podcastCreatedLink underlineLink'
							to={`/podcast/${mutationData.addPodcast.podcast.id}`}
						>
							Podcast added, click here to see!
						</Link>
					</div>
				)}
			</form>
		</div>
	);
}
export default AddPodcast;
