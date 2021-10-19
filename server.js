//dependencies
require("dotenv").config();
const {PORT, MONGODB_URL} = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const peopleSeed = require("./peopleSeed")

// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// Connection Events
mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

//models
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
});
const People = mongoose.model("People", PeopleSchema);

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//routes
//seed
app.get('/seed', (req, res) => {
	People.deleteMany({}, (error, allPeople) => {});

	People.create(peopleSeed, (error, data) => {
		res.redirect('/');
	});
});

app.get("/", (req, res) => {
    res.send("hello world")
});

//index
app.get("/people", async (req, res) => {
    try {
        res.json(await People.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

//create
app.post("/people", async (req, res) => {
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

//delete
app.delete("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

//listner
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));