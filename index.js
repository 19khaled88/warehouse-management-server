require('dotenv').config()
const express = require('express')
const app = express()

const { MongoClient, ServerApiVersion } = require('mongodb')
const cors = require('cors')
const port = process.env.PORT || 5000
const ObjectId = require('mongodb').ObjectId
//for responding to client request
var objectId = new ObjectId()
app.use(cors())

//for body parsing
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, server working')
})

//user:
//pass:
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ka5da.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

// const uri = `mongodb+srv://khaled:VNHAybzMnVDF6NMq@cluster0.ka5da.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

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
    const stockCollection = client.db('warehouse').collection('stock')

    // Home items
    app.get('/getHomeItems', async (req, res) => {
      const query = {}
      const limit = 6
      const cursor = productCollection.find(query).limit(limit)
      const items = await cursor.toArray()
      res.send(items)
    })

    // single item
    app.get('/getInventory/:id', async (req, res) => {
      const id = req.params.id
      var o_id = new ObjectId(id)
      // const query = { _id: ObjectId(id) }
    
      const cursor = await productCollection.find(ObjectId(id))

      res.send(cursor)
    })

    // manage inventory items
    app.get('/getItems', async (req, res) => {
      const query = {}
      const cursor = productCollection.find(query)
      const items = await cursor.toArray()
      res.send(items)
    })

    // index posts
    app.get('/stock', async (req, res) => {
      const query = {}
      const cursor = postCollection.find(query)
      const posts = await cursor.toArray()
      res.send(posts)
    })
    // index posts
    app.get('/postsCount', async (req, res) => {
      const query = {}
      const cursor = postCollection.find(query)
      const posts = await cursor.count()
      res.send({ posts })
    })

    // create new item
    app.post('/addItem', async (req, res) => {
      const newUser = req.body

      const result = await productCollection.insertOne(newUser)
      res.send(result)
    })

    // delete items
    app.delete('/item/:itemId', async (req, res) => {
      // const id = req.body;
      const id = req.params.itemId

      const query = { _id: ObjectId(id) }

      const result = await productCollection.deleteOne(query)
      if (result.deletedCount === 1) {
        console.log('Successfully deleted one document.')
      } else {
        console.log('No documents matched the query. Deleted 0 documents.')
      }
      // res.send(result);
    })

    // update user
    app.put('/user/:usrId', async (req, res) => {
      // const id = req.body;
      const id = req.params.usrId

      const query = { _id: ObjectId(id) }

      const options = { upsert: true }

      const updateDoc = {
        $set: {
          name: req.body.name,
          email: req.body.email,
        },
      }
      const result = await userCollection.updateOne(query, updateDoc, options)
      if (result.deletedCount === 1) {
        console.log('Successfully deleted one document.')
      } else {
        console.log('No documents matched the query. Deleted 0 documents.')
      }
      res.send(result)
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Running my mongo db')
})
app.listen(port, () => {
  console.log('listening server to port', port)
})
