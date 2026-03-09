const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//secret key for testing purpose
const JWT_SECRET = "jitterbitsecretkey";

const app = express();
const port = 3000;

//Middleware
app.use(express.json());
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send("Unauthorized");
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send("Forbidden");
        }
        req.user = user;
        next();
    });
};

//MongoDB connection
mongoose.connect("mongodb://localhost:27017/orders");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

//Users Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

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

//Register route
app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({ username: req.body.username, password: hashedPassword });
        await user.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user");
    }
});

//Login route
app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid password");
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in");
    }
});

//Create an Order
app.post("/order", authMiddleware, async (req, res) => {
    console.log("Received POST /order with body:", req.body);
    try {
        // Transform the incoming payload to match the Mongoose schema
        const transformedData = {
            orderId: req.body.numeroPedido,
            value: req.body.valorTotal,
            creationDate: new Date(req.body.dataCriacao).toISOString,
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
app.get("/order/list", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find().sort({ creationDate: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send(error);
    }
});

//Get Order by ID
app.get("/order/:id", authMiddleware, async (req, res) => {
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
app.put("/order/:id", authMiddleware, async (req, res) => {
    try {
        // Transform the incoming payload to match the Mongoose schema (same as POST)
        const transformedData = {};

        if (req.body.numeroPedido) transformedData.orderId = req.body.numeroPedido;
        if (req.body.valorTotal !== undefined) transformedData.value = req.body.valorTotal;
        if (req.body.dataCriacao) transformedData.creationDate = new Date(req.body.dataCriacao).toISOString();
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

//Delete an Order
app.delete("/order/:id", authMiddleware, async (req, res) => {
    try {
        const deleteOrder = await Order.findOneAndDelete({ orderId: req.params.id });
        if (!deleteOrder) {
            return res.status(404).send("Order not found, please make sure that your Order Number Follow this format: v10089016vdb-01");
        }
        res.json(deleteOrder);
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).send(error);
    }
});