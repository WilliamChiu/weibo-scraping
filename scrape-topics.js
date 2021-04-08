const fs = require('fs')

const puppeteer = require('puppeteer-extra')

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const TOPICS_TO_SCRAPE = 10000
const output = fs.createWriteStream("topics.txt")

const delay = time => new Promise(res => { 
      setTimeout(res, time)
})

const parseTopic = url => decodeURI(url).split("%23")[1]

let main = async () => {
  let browser = await puppeteer.launch({ headless: false })
  let page = await browser.newPage()
  await page.goto('https://reddit.com')
  await page.goto('https://s.weibo.com/top/summary/summary?cate=realtimehot', {waitUntil: "domcontentloaded"})
  await page.waitForFunction(() => location.href.includes("realtimehot"), {timeout: 0})

  let topics = await page.evaluate(() => {
    return [...new Set([...document.querySelectorAll("a")].flatMap(link => {
      if (link.href.includes("/weibo?q=%23")) {
        let href = link.href
        return href.substring(0, href.lastIndexOf("%23")+3)
      }
      return []
    }))]
  })

  topics.forEach(topic => output.write(parseTopic(topic) + "\n"))

  for (let i = 0; i < topics.length && topics.length < TOPICS_TO_SCRAPE; i++) {
    console.log("Navigating to...", topics[i])
    while (true) {
      await page.goto(topics[i], {waitUntil: "domcontentloaded"})
      let url = await page.evaluate('location.href')
      if (url.includes("/weibo?q=%23")) break
      let msDelay = Math.random() * 10000
      console.log(`Found captcha, waiting ${msDelay} ms`)
      // await delay(msDelay)
      await page.waitForFunction(() => location.href.includes("/weibo?q=%23"), {timeout: 0})
    }
    let newTopics = await page.evaluate(() => {
      return [...document.querySelectorAll("a")].flatMap(link => {
        if (link.href.includes("/weibo?q=%23")) {
          let href = link.href
          return href.substring(0, href.lastIndexOf("%23")+3)
        }
        return []
      })
    })
    newTopics.forEach(t => {
      if (!topics.includes(t)) {
        output.write(parseTopic(t) + "\n")
        topics.push(t)
      }
    })
    console.log(topics.length)
  }

  await browser.close()
}

main()