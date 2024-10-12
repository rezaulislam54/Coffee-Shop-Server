const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hflxk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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

    await client.connect();

    const coffeeCollection = client.db('CofeesDB').collection('coffees');
    const AddToCartCollection = client.db('CofeesDB').collection('myCarts');
   
    app.get("/coffees", async(req, res)=>{
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get("/coffees/:id", async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(`${id}`)}
        const result = await coffeeCollection.findOne(query)
        res.send(result);
    })

    app.get("/coffees/:email", async(req, res)=>{
      console.log(req.params.email);
      const result = await coffeeCollection.find({email: req.params.email}).toArray();
      res.send(result);
    })

    app.get("/coffees", async(req, res)=>{
      let query = {};
      if(req.query?.email){
        query = { email: req.query.email }
      }
      const result = await coffeeCollection.find(query).toArray();
      res.send(result);
    })

    app.post("/coffees", async(req, res)=>{
        const coffee = req.body;
        const result = await coffeeCollection.insertOne(coffee);
        res.send(result)
    })
    

        app.put("/coffees/:id", async(req, res)=>{
      const id = req.params.id;
      const coffee = req.body;
      const filter = {_id: new ObjectId(`${id}`)}
      const options = { upsert: true };
      const updatedCoffee = {
        $set: {
              name: coffee.name,
          quantity: coffee.quantity,
          supplier: coffee.supplier,
          category: coffee.category,
          details: coffee.details,
          taste: coffee.taste,
          price: coffee.price,
          Photo: coffee.Photo
        }
      }
      const result = await coffeeCollection.updateOne(filter,updatedCoffee,options);
      res.send(result);
    })

    app.delete("/coffees/:id", async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
    })



  //  My carts section 
    app.post("/myCarts", async(req, res)=>{
        const coffee = req.body;
        const result = await AddToCartCollection.insertOne(coffee);
        res.send(result)
    })

    app.get("/myCarts", async(req, res)=>{
        const cursor = AddToCartCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    app.get("/myCarts/:email", async(req, res)=>{
      console.log(req.params.email);
      const result = await AddToCartCollection.find({email: req.params.email}).toArray();
      res.send(result);
    })

     app.delete("/myCarts/:id", async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await AddToCartCollection.deleteOne(query);
        res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/" ,(req, res)=>{
    res.send('Coffee Stor Server is Running');
})

app.listen(port,()=>{
    console.log(`Coffee Store Server is Running port${port}`)
})