const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

//AllCars
//i12w7xSGtlko7wVk



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.BRAND_USER}:${process.env.BRAND_PASSWORD}@cluster0.gehw4nj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection

        const carCollection = client.db('carBrandDB').collection('carBrand')
        const productCollection = client.db('carBrandDB').collection('Product')
        const carImagesCollection = client.db('carBrandDB').collection('carImages')
        const addCardCollection = client.db('carBrandCarDB').collection('addCar')


        app.post('/carBrand', async (req, res) => {
            const newBrand = req.body;
            const result = await carCollection.insertOne(newBrand)
            res.send(result)

        })
        app.get('/carBrand', async (req, res) => {
            const cursor = carCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/Product', async (req, res) => {
            const newProduct = req.body
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })

        app.get('/Product', async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/product/:id', async(req, res) =>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await productCollection.findOne(query)
            res.send(result)
        })


        app.put('/Product/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const option = { Upsert: true }
            const product = req.body
            const updateProduct = {
                $set: {

                    image : product.image,
                    name : product.name,
                    type : product.type,
                    price : product.price,
                    description : product.description,
                    reating : product.reating,
                    brandName : product.brandName

                }
            }
            const result = await productCollection.updateOne(filter, updateProduct, option)
            res.send(result)
        })

        app.post('/carImages', async (req, res) => {
            const newCarImg = req.body
            const result = await carImagesCollection.insertOne(newCarImg)
            res.send(result)
        })
        app.get('/carImages', async (req, res) => {
            const cursor = carImagesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/addCar', async(req, res) =>{
            const newCard = req.body
            const result = await addCardCollection.insertOne(newCard)
            res.send(result)
        })

        app.get('/addCar', async(req, res) =>{
            const cursor = addCardCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/addCar/:id', async(req, res) =>{
            const id =req.params.id
            const query = {_id : new ObjectId(id)}
            const result = await addCardCollection.deleteOne(query)
            res.send(result)
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);








app.get('/', (res, req) => {
    req.send('New brand surver is running')
})
app.listen(port, () => [
    console.log(`surver running port is ${port}`)
])