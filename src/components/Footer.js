import React from 'react';

const Footer = () => {
	return (
		<div className='outerContainer footerContainer'>
			<p className='footerText'>
				Designed and built by{' '}
				<a
					className='underlineLink'
					href='https://github.com/davidlinke'
					target='_blank'
					rel='noopener noreferrer'
				>
					David Linke
				</a>
			</p>
			<p className='footerText deemphasized'>
				PodDialogue is a community driven project to organize and make podcast
				transcripts accessible. All content rights belong to their respective
				owners.
			</p>
		</div>
	);
};

export default Footer;
