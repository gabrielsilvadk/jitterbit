# Jitterbit Order Management API

This is a RESTful API built with **Node.js**, **Express**, and **MongoDB** for managing orders. It allows you to create, read, update, and delete orders, while securely transforming incoming Portuguese JSON payloads into English data models for database storage. 

Additionally, the API has been upgraded with **JSON Web Token (JWT)** authentication to protect the order endpoints, ensuring that only registered and authenticated users can access the data.

## 🚀 Quick Start / Configuration

### 1. Requirements
- [Node.js](https://nodejs.org/) installed
- A local [MongoDB](https://www.mongodb.com/) instance running on `localhost:27017`

### 2. Installation
Run the following command to install the required dependencies (`express`, `mongoose`, `bcryptjs`, `jsonwebtoken`):
```bash
npm install
```

### 3. Running the Server
Start the API locally by running:
```bash
node index.js
```
The server will start up, and the **Base URL** for all of your requests will be:
➡️ `http://localhost:3000`

---

## 🔒 Authentication Endpoints
Before you can interact with orders, you must create a user and log in to receive an authorization token.

### `POST /register`
Registers a new user in the system.
- **Body:**
```json
{
    "username": "admin",
    "password": "mysecretpassword123"
}
```

### `POST /login`
Authenticates a user and returns a JWT token.
- **Body:**
```json
{
    "username": "admin",
    "password": "mysecretpassword123"
}
```
- **Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

*Note: You must pass this `token` in the HTTP headers for all Order endpoints:*
- **Key:** `Authorization`
- **Value:** `Bearer YOUR_TOKEN_HERE`

---

## 📦 Order Endpoints (Secured)
*Remember to include the `Authorization` header with your JWT token for all the requests below.*

### `POST /order`
Creates a newly formatted order in the database. Expects Portuguese property names in the payload, but transforms them into English to match the database Mongoose schema.
- **Body Example:**
```json
{ 
    "numeroPedido": "v10089015vdb-01", 
    "valorTotal": 10000, 
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00", 
    "items": [ 
        { 
            "idItem": "2434", 
            "quantidadeItem": 1, 
            "valorItem": 1000 
        } 
    ] 
}
```

### `GET /order/list`
Fetches a list of all orders from the database, sorted from newest to oldest.

### `GET /order/:id`
Retrieves a specific order based on the custom `orderId` value.
- **URL Parameter:** The order's `orderId` *(Example: `/order/v10089015vdb-01`)*

### `PUT /order/:id`
Updates an existing order. This accepts the same Portuguese payload format as the `POST` route and securely applies the translation logic to update the database values.
- **URL Parameter:** The order's `orderId` *(Example: `/order/v10089015vdb-01`)*

### `DELETE /order/:id`
Deletes a specific order from the database entirely.
- **URL Parameter:** The order's `orderId` *(Example: `/order/v10089015vdb-01`)*
