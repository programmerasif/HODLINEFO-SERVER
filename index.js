const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

const username = "HODLINF"
const pass = "mwm33qNmHFDsINM7"

// middleware
app.use(cors())
app.use(express.json())


var uri = "mongodb://hodlinfo:lvudmPClKZdWK3QM@ac-wotlaa2-shard-00-00.0rmdzda.mongodb.net:27017,ac-wotlaa2-shard-00-01.0rmdzda.mongodb.net:27017,ac-wotlaa2-shard-00-02.0rmdzda.mongodb.net:27017/?ssl=true&replicaSet=atlas-as340s-shard-0&authSource=admin&retryWrites=true&w=majority";

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
    await client.connect();
    const database = client.db("HODLINEFO").collection("TopTennData");


    app.get('/topTenData', async (req, res) => {
     
      try {
        const response = await fetch('http://api.wazirx.com/api/v2/tickers');
        const data = await response.json();

        let top10Data = Object.keys(data).map((key) => {
          const item = data[key];
          return {
            name: item.name,
            last: item.last,
            buy: item.buy,
            sell: item.sell,
            volume: item.volume,
            base_unit: item.base_unit,
          };
        }).slice(0, 10);

        const result = await database.insertMany(top10Data);
        
        res.send(result);
      } catch (error) {
        console.error('Error fetching and storing data:', error);
        res.status(500).json({ error: 'Failed to fetch and store data' });
      }
    });


    app.get('/getAllData', async(req,res) =>{

      const data = await database.find().toArray();
      res.send(data)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res) =>{
    res.send('HODLINFO is comming on')
})




app.listen(port, () =>{
    console.log(`HODLINFO is comming on ${port}`);
})