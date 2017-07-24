import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { ToggleGroup } from "./ToggleMaterial"
import CircularProgress from 'material-ui/CircularProgress'

const style = {
	padding: 16
}

const submitButtonStyle ={
	marginTop: 16,
	textAlign: 'center'
}

export class FormComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			index: '',
			loading: false
		}
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleIndexChange = this.handleIndexChange.bind(this)
	}

	handleSubmit() {
		this.setState({loading: true})
		this.props.onSubmit(this.state.index, () => this.setState({loading: false}))
	}

	handleIndexChange(e) {
		if (typeof e.target.value !== 'number') {
			this.setState({
				indexInputError: true
			})
		} else {
			this.setState({
				indexInputError: false
			})
		}
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	render() {
		return (
			<div style={style} >

				<TextField floatingLabelText="Index"
				 	name="index"
				 	errorText={() => {
				 		if (this.state.indexInputError) {
				 			return "Index must be a number"
				 		} else {
				 			return null
				 		}
				 	}}
				 	onSubmit={this.handleSubmit}
				 	onChange={this.handleIndexChange}/><br/>
				 <ToggleGroup />
				
				<RaisedButton label='search' 
					backgroundColor="#303f9f"
					labelColor="#ffffff"
					style={submitButtonStyle}
					onClick={this.handleSubmit}/><br/>

				{this.state.loading ? <CircularProgress style={{margin: 8}}/> : null }

			</div>
		);
	}	
}