import React from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const resultsStyle = {
	padding: 16,
	width: '100%'
}

export class ResultsComponent extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		var variantVals = JSON.parse(this.props.json)
		const listSearch = variantVals.search.map((query) =>
  			<li>{query}</li>
  			)
		return (
			<div style={resultsStyle}>
				<Card>
					<CardHeader
						title="Results"
						subtitle={"For index: ", this.props.index}
						titleStyle={{'fontWeight':'bold', 'fontSize':20}} />
						<CardText>Finding: 
							<ul>{listSearch}</ul>
						</CardText>
				</Card>
			</div>
			);
	}
}