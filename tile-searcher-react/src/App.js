import React, { Component } from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { FormComponent } from './FormComponent'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import AppBar from 'material-ui/AppBar';
import { ResultsComponent } from './ResultsComponent'
import './App.css'
import Axios from 'axios'

injectTapEventPlugin()

const muiTheme = getMuiTheme({
	palette: {
		textColor: 'cyan500',
	},
	appBar: {
	},
});

class App extends Component {

	constructor(props) {
		super(props)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.state = {
			resultsLoaded: false,
			responseJson: ""
		}
	}

	handleSubmit(index, callback) {
		this.setState({resultsLoaded: false})
		Axios.get(`http://192.168.1.156:8080/tile?index=1792420&all=true&json=true`)
			.then((response) => {
				this.setState({
					responseLoaded: true,
					index: index,
					responseJson: response.data
				})
				alert("recieved response")
			.catch((error) => {
				alert(error)
			})
			alert(this.state.responseJson)
			callback()
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
