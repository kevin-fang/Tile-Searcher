import axios from 'axios'

export function callApi(index, callback) {
	/*Axios.get('http://apiv3.iucnredlist.org/api/v3/version', {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'text/json'
				}
		})
			.then((response) => {
				alert("recieved response: " + response)
				callback(response.data, null)
			})
			.catch((error) => {
				callback(null, error)
			}) */
	fetch('http://192.168.1.156:8080/tile?index=1792420&json=true&all=true', {mode: 'no-cors'})
		.then(res => {
			alert(res)
		})
		.catch((error) => {
			alert("error: " + error)
		})
}