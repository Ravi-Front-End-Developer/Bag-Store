const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const path = require("path");

// IMPORT DB CONNECTION
const dbConnection = require("./config/mongoose-connection");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// IMPORT DOTENV
require("dotenv").config();

// IMPORT CORS
const cors = require("cors");
const corsOptions = require("./middlewares/cors");

// APPLY CORS BEFORE ROUTES
app.use(cors(corsOptions));

// API ROUTES TO SPECIFIC FILES
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const cartRoutes = require("./routes/cartRoutes");
const profileRoutes = require("./routes/profileRoutes");

// MIDDLEWARES
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/owners", ownerRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/profile", profileRoutes);

// LISTENING PORT
app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});
