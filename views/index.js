import React from 'react';
import { hydrate } from "react-dom"
import App from './app.jsx'
import { BrowserRouter } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

hydrate((
		<BrowserRouter>
			<MuiThemeProvider>
				<App />
			</MuiThemeProvider>
		</BrowserRouter>
	), document.getElementById('app')
);
