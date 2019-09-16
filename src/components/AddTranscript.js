import React from 'react';
import useForm from 'react-hook-form';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const ADD_TRANSCRIPT_MUTATION = gql`
	mutation(
		$episodeId: ID!
		$transcript: String!
		$transcriptAddedByUserId: ID!
	) {
		addEpisodeTranscript(
			input: {
				episodeId: $episodeId
				transcript: $transcript
				transcriptAddedByUserId: $transcriptAddedByUserId
			}
		) {
			episode {
				id
				transcriptAddedDate
			}
		}
	}
`;

function AddTranscript(props) {
	const { register, handleSubmit, getValues } = useForm();
	const [
		addNewTranscript,
		{ loading: mutationLoading, error: mutationError, data: mutationData }
	] = useMutation(ADD_TRANSCRIPT_MUTATION);

	const onSubmit = () => {
		const values = getValues();

		addNewTranscript({
			variables: {
				episodeId: props.episodeId,
				transcript: values.transcript,
				transcriptAddedByUserId: 1
			}
		});
	};

	return (
		<div className='addTranscriptContainer'>
			<div className='centered'>
				<h2>Add Transcript</h2>
			</div>
			<form className='addPodcastForm' onSubmit={handleSubmit(onSubmit)}>
				<textarea
					name='transcript'
					placeholder='Paste transcript here.'
					ref={register({ required: true })}
					className='transcript textInput textArea'
				/>

				<input type='submit' value='Add Transcript' className='inputCentered' />
				{mutationLoading && (
					<p className='addingPodcastState'>Adding Transcript...</p>
				)}
				{mutationError && (
					<p className='errorCreatingPodcast'>Error, please try again.</p>
				)}
				{mutationData && props.setRefetchAll(true)}
				{mutationData && props.setShowAddTranscript(false)}
			</form>
		</div>
	);
}
export default AddTranscript;
