const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.glcj3l3.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const serviceCollection = client.db("carDoc").collection("services");
        const userCollection = client.db("carDoc").collection("users");

        app.get("/services", async (req, res) => {
            const result = await serviceCollection.find().toArray();
            res.send(result);
        })
        
        app.post("/users", async (req, res) => {
            const userInfo = req.body;
            const email = userInfo?.email;
            const query = {email : email};
            const user = await userCollection.findOne(query);
            if(user){
                return res.send({message : "User already exists!"})
            }
            const result = await userCollection.insertOne(userInfo);
            res.send(result);
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);


app.get("/", (Req, res) => {
    res.send("Car Doctor is serving")
})

app.listen(port, () => {
    console.log(`Car Doctor is serving on port ${port}`);
})