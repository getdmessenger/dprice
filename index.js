const { Client } = require('dhub')
const  PriceTree = require('./classes/PriceTree')

const DTree = require('dwebtree')

start()

async function start() {
  const { basestore, replicate } = new Client()
  const store = basestore()
  
  const base = store.get({ name: 'dprice' })
  const db = new DTree(base, {
    keyEncoding: 'utf-8', valueEncoding: 'utf-8'
  })

  await replicate(base)
  console.log('The dTree key is: ', base.key.toString('hex'))

  const priceTree = new PriceTree(db)
  await priceTree.dispatchPrices()
}
