const fetch = require("node-fetch");

const cmcKey = 'f28a642b-acaf-42dc-8a7c-229a6cd1828f'

const intervalTime = 60000 * 30
let priceInterval

class PriceTree {

  db;
  constructor(db) {
    this.db = db
  }

   async dispatchPrices (db,enable = true) {
    clearInterval(priceInterval)
    if (!enable) return
    return new Promise(async resolve => {
      const setPrices = async () => {
        await PriceTree.setPrices(db)
        resolve(true)
      }
      await setPrices(db)
      priceInterval = setInterval(async () => {
        await setPrices(db)
      }, intervalTime)
    })
  }

  static async getPrices () {

    return new Promise((resolve, reject) => {
      
      fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        headers: { 'X-CMC_PRO_API_KEY': cmcKey },
        json: true,
        gzip: true
      }).then(x =>
         x.json()).then((res) => {
          resolve(res)
        })
        .catch((errr) => {
        console.log("error: Unable to connect to CMC API.",errr)
      })

    });
    // return await Promise.race[(
    //   new Promise(resolve => setTimeout(() => resolve(false), 2500)),
    //   fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
    //     headers: { 'X-CMC_PRO_API_KEY': cmcKey },
    //     json: true,
    //     gzip: true
    //   }).then(x =>
    //      x.json()).then((res) => {
    //       resolve(res)
    //     })
    //     .catch((errr) => {
    //     console.log("error: Unable to connect to CMC API.",errr)
    //   })
    // )]
  }


  static async setPrices(db) {
      const prices = await PriceTree.getPrices()

      console.log("processs ",prices.status);
    //const { db } = this
    if (!prices || prices.error) return
    prices.data.forEach(async (x) => {
      console.log("bitcoinnn",x ," ",x.quote.USD.price);
      var name  = x.name
      const batch = db.batch()
      await batch.del(`!prices!${name}`,x.quote.USD.price)
      await batch.put(`!prices!${name}`, x.quote.USD.price)
      await batch.flush()
    })
  }
}

module.exports = PriceTree
