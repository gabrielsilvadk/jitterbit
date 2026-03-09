const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

//Middleware
app.use(express.json());

//MongoDB connection
mongoose.connect("mongodb://localhost:27017/orders");

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

const Order = mongoose.model("Order", orderSchema);

//Routes
app.post("/order", async (req, res) => {
    console.log("Received POST /order with body:", req.body);
    try {
        const order = new Order(req.body);
        await order.save();
        console.log("Order saved successfully:", order);
        res.status(201).send(order);
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(400).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});