require('dotenv/config')
const mongoose = require('mongoose')

const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
// const cluster = process.env.MONGO_URL;
// const db = process.env.MONGO_DB;


const connect = async () => {
    mongoose.connect("mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ex15p.mongodb.net/instaslut?retryWrites=true&w=majority", {
        pass,
        user,
        useNewUrlParser: true,
        useUnifiedTopology: true,

    });
}

module.exports = connect;