import React from 'react'
import Toggle from 'material-ui/Toggle';

export class ToggleGroup extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tileName: false,
			basePairLocations: false,
			getVariants: false,
			getDiffIndices: false,
			indexInputError: false 
		}
		this.handleToggle = this.handleToggle.bind(this)
	}

	handleToggle() {
		alert(this.props.name + " was toggled")
	}

	render() {
		return (
			<div>
				<Toggle name="tileName" 
					label="Get Tile Name" 
					labelPosition="right"
					onToggle={() => {
						this.setState({
							tileName: !this.state.tileName
							})
						}
					}/>
				<Toggle name="basePairLocations" 
					label="Get Base Pair Locations" 
					labelPosition="right"
					onToggle={() => {
						this.setState({
							basePairLocations: !this.state.basePairLocations
							})
						}
					}/>
				<Toggle name="getVariants" 
					label="Get Variants" 
					labelPosition="right"
					onToggle={() => {
						this.setState({
							getVariants: !this.state.getVariants
							})
						}
					}/>
				<Toggle name="getDiffIndices" 
					label="Get Diff Indices" 
					labelPosition="right"
					onToggle={() => {
						this.setState({
							getDiffIndices: !this.state.getDiffIndices
							})
						}
					}/>
			</div>
			)
	}
}