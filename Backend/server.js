const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');
require('dotenv').config();
const app = express();



//middleware --------------------------------------------------
app.set('view engine','ejs');

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());



app.use(session({
    secret: "yourSecretKey",   // change this to something secure
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // secure:true only if using HTTPS
}));

const cors = require("cors");
app.use(cors());

// database connection---------------
// const url = 'mongodb://127.0.0.1:27017/';
// const database = 'farmer';
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("successfully connected!");
})
.catch(()=>{
    console.log("database not connected!");
});

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// routes----------------------------------
app.get('/home',(req,res)=>{
res.render('home',{error:null});
});

app.get('/signup',(req,res)=>{
res.render('signup',{error:null});
});

app.get('/login',(req,res)=>{
res.render('login',{error:null});
});
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
});


app.post('/signup', async (req, res) => {
    try {
        const { username, email, password,confirmPassword} = req.body;

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            return res.json({ success: false, message: "⚠️ All fields are required!" });
        }

        if (password.length < 6) {
             return res.json({ success: false, message: "⚠️ Password must be at least 6 characters!" });
        }

        if (password !== confirmPassword) {
            return res.json({ success: false, message: "⚠️ Passwords do not match!" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
             return res.json({ success: false, message: "⚠️ Email already registered!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const newUser = new User({ username, email, password:hashedPassword});
        await newUser.save();
         return res.json({ success: true, message: "✅ Signup successful! Redirecting..." });

    } catch (err) {
        console.error(err);
         return res.json({ success: false, message: "⚠️ Something went wrong, try again!" });
    }
});

// Login POST Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("login", { error: "⚠️ Email and Password required!" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.render("login", { error: "⚠️ Invalid Email or Password!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("login", { error: "⚠️ Invalid Email or Password!" });
        }

        // Success → Go to home
        req.session.user = user; // save session
        res.redirect("home");
        // res.render("home", { error: null, user });

    } catch (err) {
        console.error(err);
        res.send("error is come");
        // res.render("login", { error: "⚠️ Something went wrong!" });
    }
});


// server is running-----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:5000/home`);
});
// app.listen(5000, "0.0.0.0", () => console.log("Server running on 0.0.0.0:5000"));

// http://192.168.218.1:5000/home
