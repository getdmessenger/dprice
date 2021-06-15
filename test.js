const { Client } = require('dhub')
const DTree = require('dwebtree')

const PUBLIC_KEY = 'e06808a23b37641dcd93a976a1b2d776a8a60e9a8222c31ed4c98ac949a24672'

start()

async function start() {
  const { basestore, replicate } = new Client()
  const store = basestore()

  const base = store.get({ key: PUBLIC_KEY, valueEncoding: 'json' })
  const db = new DTree(base, { keyEncoding: 'utf-8', valueEncoding: 'utf-8' })

  await replicate(base)
  
  let bitcoinData = await db.get('!prices!Bitcoin')

  var data = bitcoinData.value
  console.log("ssss",bitcoinData ," ",JSON.parse(bitcoinData.value));
  console.log('Bitcoin price is: ', bitcoinData.value.quote.USD)
  console.log('Bitcoin data is: ', bitcoinData)
}