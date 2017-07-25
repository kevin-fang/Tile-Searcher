import React from 'react'
import {Card, CardHeader, CardText} from 'material-ui/Card';
import "./App.css"

const resultsStyle = {
	margin: 16,
	width: '90%',
	height: '90%',
	wordWrap: 'break-all',
	whiteSpace: 'normal'
}

export class ResultsComponent extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		var variantVals = JSON.parse(JSON.stringify(this.props.json))
		var searchedItems = variantVals.search != null ? variantVals.search[0] : null
		if (searchedItems != null) {
			for (var i = 1; i < variantVals.search.length; i++) {
				searchedItems += ", " + variantVals.search[i]
			}
			searchedItems += '.'
		}
		var tileName = variantVals.name

		var tileStep, tilePath, tilePhase = null
		if (variantVals.tile_path != null) {
			tilePath = variantVals.tile_path
			tileStep = variantVals.tile_step
			tilePhase = variantVals.tile_phase
		}

		var bpStart = variantVals.base_pair_start
		var bpEnd = variantVals.base_pair_end

		var variantList = variantVals.variants != null ? [] : null
		if (variantList != null) {
			for (var i = 0; i < variantVals.variants.length; i++) {
				variantList.push(<li class="wordWrap">{variantVals.variants[i]}</li>)
			}
		}
		//alert(variantList.length)
		var diffIndices = variantVals.different_indices != null ? variantVals.different_indices.toString() : null
		return (
			<div style={resultsStyle}>
				<Card style={{wordWrap: 'break-all', whiteSpace: 'normal'}}>
					<CardHeader
						title="Results"
						subtitle={"For index: " + this.props.index}
						titleStyle={{'fontWeight':'bold', 'fontSize':20}} />
						<CardText >
							{searchedItems != null ? 
								<p><b>Searched for:<br/></b> {searchedItems}</p> : 
								<p>Error</p>}
							<div>
								{tileName != null ? <p><b>Tile Name:</b> {tileName}</p> : null}
							</div>
							<ul>
								{tilePath != null ? <li>Tile Path: {tilePath}</li>: null}
								{tileStep != null ? <li>Tile Step: {tileStep}</li> : null}
								{tilePhase != null ? <li>Tile Phase: {tilePhase}</li> : null}
							</ul>
							<div>
								{bpStart != null && bpEnd != null ? <p><b>Base Pair Information:</b></p> : null }
								<ul>
								{bpStart != null ? <li><b>Base Pair Start:</b><br/>{bpStart}</li> : null}
								{bpEnd != null ? <li><b>Base Pair End:</b><br/>{bpEnd}</li> : null}
								</ul>
							</div>
							<div>
								{diffIndices != null ? <p>Different Indices: {diffIndices}</p> : null}
							</div>
							<div>
								{variantList != null ? variantList : null}
							</div>
						</CardText>
				</Card>
			</div>
			);
	}
}
