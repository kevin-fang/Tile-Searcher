var express = require("express")
var app = express()
var PythonShell = require("python-shell")

app.get('/tile', (req, res) => {
	index = req.query.index
	console.log("Finding tile for index: " + index)
	res.setHeader('Content-Type', 'text/plain')
	var options = {
		mode: 'text',
		scriptPath: '../svc-eye-classifier/tiling/',
		args: ['--hiq-info=../svc-eye-classifier/tiling/hiq-pgp-info', '--index=' + index, '-l', '--assembly-fwi=../svc-eye-classifier/tiling/assembly.00.hg19.fw.fwi', '-b', '--assembly-gz=../svc-eye-classifier/tiling/assembly.00.hg19.fw.gz']
	}
	var shell = new PythonShell('getTileVariants.py', options)
	var results = new Object()
	shell.on('message', (message) => {
		res.write(message + '\n')
	})
	shell.on('error', (err) => {
		res.write("An error occured. Please send the following information to the server host:\n" + err)
		console.log(err)
	})
	shell.on('close', () => {
		res.end();
	})
})

const port = 8080
app.listen(port);

console.log("Listening on port: " + port)
