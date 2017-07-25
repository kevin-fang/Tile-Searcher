import Axios from 'axios'

export function callApi(searchObject, callback) { 
	Axios.get(`http://192.168.1.156:8080/tile?
		index=${searchObject.index}
		&get_base_locs=${searchObject.getBasePairLocations}
		&get_variants=${searchObject.getVariants}
		&get_name=${searchObject.getTileName}
		&get_diff_indices=${searchObject.getDiffIndices}
		&json=true`, {
			headers: {
				'Content-Type': 'text/json'
				}
		})
		.then((response) => {
			//alert("successful" + JSON.stringify(response.data))
			callback(response.data, null)
		})
		.catch((error) => {
			alert("error" + error)
			console.log(error)
			callback(null, error)
		}) 
}
