import Axios from 'axios'

export function callApi(index, callback) {
	Axios.get('http://10.1.1.136:8080', {
			headers: {
				'Content-Type': 'text/json'
				}
		})
			.then((response) => {
				callback(response.data, null)
			})
			.catch((error) => {
				console.log(error)
				callback(null, error)
			})
	/*fetch('http://192.168.1.156:8080/tile?index=1792420&json=true&all=true', {mode: 'no-cors'})
		.then(res => {
			alert(res)
		})
		.catch((error) => {
			alert("error: " + error)
		}) */
}
