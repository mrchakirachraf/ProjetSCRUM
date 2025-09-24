const express = require("express");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.route");


const app = express();
app.use(cors());
app.use(express.json());

/*app.use(cors({
  origin: "http://localhost:3001", // Remplace par le port de ton frontend
  credentials: true                
}));*/

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // mettre true si HTTPS
  })
);

app.use("/api/auth", authRoutes);


app.listen(3000, () => console.log("Server running on port 3000"));