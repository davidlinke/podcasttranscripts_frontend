import React from 'react';

const Footer = () => {
	return (
		<div className='outerContainer footerContainer'>
			<p>
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
		</div>
	);
};

export default Footer;
