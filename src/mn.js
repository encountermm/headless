const puppeteer = require('puppeteer')
const { screenshot, mn } = require('./config/default')
const chalk = require('chalk')
const srcToImg = require('./helper/srcToImg')

;(async () => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto('https://image.baidu.com/')

	console.log(`go to ${chalk.green('https://image.baidu.com/')}`)

	await page.setViewport({
		width: 1920,
		height: 4000
	})

	await page.focus('#kw')

	await page.keyboard.sendCharacter('猫')

	await page.click('.s_search')

	console.log(`go to ${chalk.green('search list')}`)

	page.on('load', async () => {
		console.log(`we can get the img List`)

		const imgSrcList = await page.$$eval('img.main_img', images => {
			return Array.prototype.map.call(images, img => img.src)
		})

		console.log(`get ${chalk.green(imgSrcList.length)} images,start download `)

		imgSrcList.forEach(async src => {
			//sleep
			await page.waitFor(200)

			await srcToImg(src, mn)
		})

		await browser.close()
	})
})()
