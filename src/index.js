import React from 'react';
import ReactDOM from 'react-dom';
import './css/normalize.css';
import './css/app.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter as Router } from 'react-router-dom';

const link = createHttpLink({
	uri: process.env.REACT_APP_BASEURL
});

const client = new ApolloClient({
	link: link,
	cache: new InMemoryCache()
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<Router>
			<App />
		</Router>
	</ApolloProvider>,
	document.getElementById('root')
);

serviceWorker.unregister();
