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
//Create an Order
app.post("/order", async (req, res) => {
    console.log("Received POST /order with body:", req.body);
    try {
        // Transform the incoming payload to match the Mongoose schema
        const transformedData = {
            orderId: req.body.numeroPedido,
            value: req.body.valorTotal,
            creationDate: req.body.dataCriacao,
            items: req.body.items ? req.body.items.map(item => ({
                productId: item.idItem,
                quantity: item.quantidadeItem,
                price: item.valorItem
            })) : []
        };

        const order = new Order(transformedData);
        await order.save();
        console.log("Order saved successfully:", order);
        res.status(201).send(order);
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(400).send(error);
    }
});

//List all orders
app.get("/order/list", async (req, res) => {
    try {
        const orders = await Order.find().sort({ creationDate: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send(error);
    }
});

//Get Order by ID
app.get("/orders/:id", async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id });
        if (!order) {
            return res.status(404).send("Order not found, please make sure that your Order Number Follow this format: v10089016vdb-01");
        }
        res.json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

//Update an Order   
app.put("/orders/:id", async (req, res) => {
    try {
        // Transform the incoming payload to match the Mongoose schema (same as POST)
        const transformedData = {};

        if (req.body.numeroPedido) transformedData.orderId = req.body.numeroPedido;
        if (req.body.valorTotal !== undefined) transformedData.value = req.body.valorTotal;
        if (req.body.dataCriacao) transformedData.creationDate = req.body.dataCriacao;
        if (req.body.items) {
            transformedData.items = req.body.items.map(item => ({
                productId: item.idItem,
                quantity: item.quantidadeItem,
                price: item.valorItem
            }));
        }

        const updateOrder = await Order.findOneAndUpdate(
            { orderId: req.params.id },
            { $set: transformedData },
            { new: true }
        );

        if (!updateOrder) {
            return res.status(404).send("Order not found, please make sure that your Order Number Follow this format: v10089016vdb-01");
        }
        res.json(updateOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).send(error);
    }
});
