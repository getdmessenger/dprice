const cmcKey = 'f28a642b-acaf-42dc-8a7c-229a6cd1828f'
const intervalTime = 60000 * 30
let priceInterval

class PriceTree {
  constructor(db) {
    this.db = db
  }

  static async dispatchPrices (enable = true) {
    clearInterval(priceInterval)
    if (!enable) return
    return new Promise(async resolve => {
      const setPrices = async () => {
        await PriceTree.setPrices()
        resolve(true)
      }
      await setPrices()
      priceInterval = setInterval(async () => {
        await setPrices()
      }, intervalTime)
    })
  }

  static async getPrices () {
    return await Promise.race[(
      new Promise(resolve => setTimeout(() => resolve(false), 2500)),
      fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        headers: { 'X-CMC_PRO_API_KEY': cmcKey },
        json: true,
        gzip: true
      }).then(x =>
         x.json()).then(res => 
        resolve(res)).catch(() => {
        console.log("error: Unable to connect to CMC API.")
      })
    )]
  }


  static async setPrices() {
      const prices = await PriceTree.getPrices()
    const { db } = this
    if (!prices || prices.error) return
    prices.forEach(async (x) => {
      const { name } = x
      const batch = db.batch()
      await batch.del(`!prices!${name}`)
      await batch.put(`!prices!${name}`, x)
      await batch.flush()
    })
  }
}

module.exports = PriceTree
