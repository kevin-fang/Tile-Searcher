var express = require("express")
var app = express()
var PythonShell = require("python-shell")

app.get('/tile', (req, res) => {
	index = req.query.index
	json = req.query.json
	get_base_locs = req.query.get_base_locs
	get_variants = req.query.get_variants
	get_name = req.query.get_name
	get_all = req.query.all
	if (get_all) {
		get_base_locs = 'true'
		get_variants = 'true'
		get_name = 'true'
	}
	console.log("Finding tile for index: " + index + ", json status: " + json)
	res.setHeader('Content-Type', 'text/json')
	var options = {
		mode: 'text',
		scriptPath: '../svc-eye-classifier/tiling/',
		args: ['--hiq-info=../svc-eye-classifier/tiling/hiq-pgp-info', '--index=' + index, '--assembly-fwi=../svc-eye-classifier/tiling/assembly.00.hg19.fw.fwi', '--assembly-gz=../svc-eye-classifier/tiling/assembly.00.hg19.fw.gz', '--keep=./keep/by_id/su92l-4zz18-fkbdz2w6b25ayj3']
	}
	if (get_base_locs == 'true') {
		options.args.push('-b')
		console.log("Finding base pair locations")
	}
	if (get_variants == 'true') {
		options.args.push('-v')
		console.log("Finding variants")
	}
	if (get_name == 'true') {
		options.args.push('-l')
		console.log("Finding tile name")
	}
	var shell = new PythonShell('getTileVariants.py', options)
	var results = ""
	shell.on('message', (message) => { results = results + message + '\n' })
	shell.on('error', (err) => {
		res.write("An error occured. Please send the following information to the server host:\n" + err)
		console.log(err)
	})
	shell.on('close', () => {
		resultsObj = new Object()
		resultsObj.search = []	
		if (results.includes("Tile location")) {
			resultsObj.search.push("Tile Location")
		}
		if (results.includes("Base pair location")) {
			resultsObj.search.push("Base Pair Location")
		} 
		if (results.includes("Variant Information")) {
			resultsObj.search.push("Variant Information")
		} 
		if (results.includes("Variant Diff Information")) {
			resultsObj.search.push("Variant Diff Information ")
		}
		
		resultsArr = results.split('\n')
		console.log(resultsArr)
		for (var i = 0; i < resultsArr.length; i++) {
			if (resultsArr[i].includes("Tile Path")) {
				resultsObj.tile_path = resultsArr[i].substring(11)
			} else if (resultsArr[i].includes("Tile Step")) {
				resultsObj.tile_step = resultsArr[i].substring(11)
			} else if (resultsArr[i].includes("Tile Phase")) {
				resultsObj.tile_phase = resultsArr[i].substring(12)
			} else if (resultsArr[i].includes("Base pair location")) {
				resultsObj.base_pair_start = resultsArr[i + 1]
				resultsObj.base_pair_end = resultsArr[i + 2]
			} else if (resultsArr[i].includes("hg19")) {
				resultsObj.name = resultsArr[i]
			} else if (resultsArr[i].includes("Variant Information")) {
				resultsObj.variants = []
				i += 1
				while (resultsArr[i].includes('.00.')) {
					resultsObj.variants.push(resultsArr[i])
					i += 1
				}
			}
		}


		if (json == 'true') {
			res.write(JSON.stringify(resultsObj));
		} else {
			res.write(results)
		}
		res.end();
	})
})

const port = 8080
app.listen(port);

console.log("Listening on port: " + port)
