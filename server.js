const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();

app.use(express.json());

const PORT = 4000;

const mongo_url = "mongodb://localhost:27017/assignment3";
let db;

async function connect(){
    try{
        const connection = await MongoClient.connect(mongo_url);
        db = connection.db();
    }
    catch(error){
        throw error;
    }
}
connect();

app.post('/blogs', async (req, res) => {
    try {
        const { title, body, author } = req.body;
        if(!title || !body || !author){
            return res.status(400).send({ error: "Title, body, and author are required" });
        }
        const blog = {title, body, author, timestamp: new Date()};
        const result = await db.collection('blogs').insertOne(blog);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.get('/blogs', async (req, res) => {
    try {
        const result = await db.collection('blogs').find().toArray();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.get('/blogs/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const result = await db.collection('blogs').findOne({_id: new ObjectId(id)});
        if(!result)
            res.status(404).send({error: "Post not found"});
        else
            res.status(200).send(result);
    }
    catch(error){
        res.status(500).send(error.toString());
    }
});

app.put('/blogs/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const blog = req.body;
        const result = await db.collection('blogs').updateOne({_id: new ObjectId(id)}, {$set: blog});
        if(result.modifiedCount === 0)
            res.status(404).send({error: "Post not found"});
        else
            res.status(200).send(result);
    }
    catch(error){
        res.status(500).send(error.toString());
    }
});

app.delete('/blogs/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const result = await db.collection('blogs').deleteOne({_id: new ObjectId(id)});
        if(result.deletedCount === 0)
            res.status(404).send({error: "Post not found"});
        else
            res.status(200).send(result);
    }
    catch(error){
        res.status(500).send(error.toString());
    }
});

app.listen(PORT, ()=>{
    console.log("Server runs at port " + PORT);
});