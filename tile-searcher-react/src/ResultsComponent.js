import React from 'react'
import {Card, CardHeader, CardText} from 'material-ui/Card';

const resultsStyle = {
	padding: 16,
	width: 250
}

export class ResultsComponent extends React.Component {
	render() {
		var variantVals = JSON.parse(JSON.stringify(this.props.json))
		const listSearch = variantVals.search.map((query) =>
  			<li>{query}</li>
  			)
		return (
			<div style={resultsStyle}>
				<Card>
					<CardHeader
						title="Results"
						subtitle={"For index: " + this.props.index}
						titleStyle={{'fontWeight':'bold', 'fontSize':20}} />
						<CardText>Finding:
							<ul>{listSearch}</ul>
						</CardText>
				</Card>
			</div>
			);
	}
}
