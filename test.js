const { Client } = require('dhub')
const DTree = require('dwebtree')

const PUBLIC_KEY = X

start()

async function start() {
  const { basestore, replicate } = new Client()
  const store = basestore()

  const base = store.get({ key: PUBLIC_KEY, valueEncoding: 'json' })
  const db = new DTree(base, { keyEncoding: 'utf-8', valueEncoding: 'utf-8' })

  await replicate(base)
  
  let bitcoinData = await db.get('!prices!bitcoin')
  console.log('Bitcoin price is: ', bitcoinData.value.quote.USD)
  console.log('Bitcoin data is: ', bitcoinData)
}