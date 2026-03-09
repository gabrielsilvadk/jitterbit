const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

//Middleware
app.use(express.json());

//MongoDB connection
mongoose.connect("mongodb://localhost:27017/orderapi");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

//Order Schema
const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    value: { type: Number, required: true },
    creationDate: { type: Date, required: true },
    items: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ]
});