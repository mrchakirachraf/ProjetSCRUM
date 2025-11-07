require("dotenv").config(); 
const express = require("express");
const session = require("express-session");
const cors = require("cors");



const authRoutes = require("./routes/auth.route");
const userInfoRoutes = require("./routes/userInfo.route"); 
const depenseRoutes = require('./routes/depense.route');

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true 
}));

app.use(express.json());




app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false,

    }, 
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userInfoRoutes);
app.use('/api/depenses', depenseRoutes);




app.listen(3000, () => console.log("Server running on port 3000"));