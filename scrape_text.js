const fs = require('fs')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const TOPICS_TO_SCRAPE = 10000

const delay = time => new Promise(res => { 
      setTimeout(res, time)
})

const parseTopic = url => decodeURI(url).split("%23")[1]

let main = async () => {
  let browser = await puppeteer.launch({ headless: true })
  let page = await browser.newPage()
  topic = process.argv[2]
  const url = `https://s.weibo.com/weibo?q=%23${topic}%23`
  await page.goto(url, {waitUntil: "domcontentloaded"})
  let topics = await page.evaluate(() => {
    return [...document.getElementsByClassName("txt")].flatMap(text => {
      return text.textContent
    })
  })
  topics.forEach(t => {
    if (/[a-zA-Z]/.test(t)) {
      teme = t.replace((/  |\r\n|\n|\r/gm),"").replace(/[^a-zA-Z]/gi, ' ').replace(/  +/g, ' ').split(" ");
      // teme = teme.filter(ele => !ele.includes("http://"))
      if (teme.some(s => s.length >= 2 )) {
        console.log(t.replace((/  |\r\n|\n|\r/gm), ""))
      }
    }
  })

  await delay(1000)

  await browser.close()
}

main()