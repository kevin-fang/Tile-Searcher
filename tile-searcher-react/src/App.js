import React, { Component } from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { FormComponent } from './FormComponent'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import AppBar from 'material-ui/AppBar';
import { ResultsComponent } from './ResultsComponent'
import './App.css'
import request from 'superagent'
import { callApi } from "./api"

injectTapEventPlugin()

const muiTheme = getMuiTheme({
	appBar: {
		height: 50
	},
});

class App extends Component {

	constructor(props) {
		super(props)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.state = {
			resultsLoaded: false,
			responseJson: "",
			index: -1
		}
	}

	handleSubmit(index, callback) {
		this.setState({resultsLoaded: false})
		callApi(index, (responseJson, err) => {
			if (err == null) {
				this.setState({
						responseLoaded: true,
						index: index,
						responseJson: responseJson
					})
				callback(null)
			} else {
				alert(err)
				this.setState({
					responseLoaded: true
				})
				callback(err)
			}
		})
		
	}

  	render() {
    	return (
			<MuiThemeProvider muiTheme={muiTheme}>
		        <div>
		        	<AppBar 
		        	title="Tile Searcher"
		        	showMenuIconButton={false}/>
		        	<div className="rowC">
						<FormComponent onSubmit={this.handleSubmit}/>	
						{this.state.resultsLoaded ? <ResultsComponent json={this.state.responseJson} index={this.state.index}/> : null}
					</div>
				</div>
			</MuiThemeProvider>
    	)
  	}
}

export default App;
