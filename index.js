const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb')
const cors = require('cors')
const port = process.env.PORT || 3000

//for responding to client request
app.use(cors())

//for body parsing
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, server working')
})

//user:
//pass:

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ka5da.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

async function run() {
  try {
    await client.connect()
    const productCollection = client.db('warehouse').collection('product')

    app.get('/product', (req, res) => {})

    app.post('/product', (req, res) => {
      const data = req.body
      console.log(data)
      res.send('data posted to mongodb')
    })

    app.post('/stock', async (req, res) => {
      const data = req.body
      console.log(data)
      const result = await productCollection.insertOne(data)
      res.send(result)
    })
  } finally {
    // await client.close()
  }
}
run().catch(console.dir)

app.listen(port, () => {
  console.log('listening server to port', port)
})
