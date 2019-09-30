const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const writeFile = promisify(fs.writeFile)

module.exports = async (src, dir) => {
	// console.log(src)
	if (/\.(jpg|png|gif)$/.test(src)) {
		await urlToImage(src, dir)
	} else {
		await base64ToImage(src, dir)
	}
}

// url => image
const urlToImage = promisify((url, dir, callback) => {
	const mod = /^https:/.test(url) ? https : http
	const ext = path.extname(url)
	const file = path.join(dir, `${Date.now()}${ext}`)

	mod.get(url, res => {
		res.pipe(
			fs.createWriteStream(file).on('finish', () => {
				callback()
				console.log(file)
			})
		)
	})
})
// base64 => image
const base64ToImage = async (base64Str, dir) => {
	// data:image/jpeg;base64,/hsdjkff
	const matches = base64Str.match(/^data:(.+?);base64,(.+)$/)

	try {
		const ext = matches[1].split('/')[1].replace('jpeg', 'jpg')
		const file = path.join(dir, `${Date.now()}.${ext}`)

		await writeFile(file, matches[2], 'base64')
		console.log(file)
	} catch (ex) {
		console.log('非法的base64字符串')
	}
}
