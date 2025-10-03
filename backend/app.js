require("dotenv").config(); 
const express = require("express");
const session = require("express-session");
const cors = require("cors");



const authRoutes = require("./routes/auth.route");
const userInfoRoutes = require("./routes/userInfo.route"); 

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3001", // ton frontend
  credentials: true // ⚡ obligatoire pour envoyer les cookies
}));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // mettre true si HTTPS
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userInfoRoutes);



app.listen(3000, () => console.log("Server running on port 3000"));