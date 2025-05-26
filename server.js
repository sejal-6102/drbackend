const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require('path'); // <<<< YEH SAHI HAI

const enrollRoutes = require("./routes/enrollroutes");
const bookRoutes = require("./routes/booknowroutes");
const contactRoutes = require("./routes/contactRoutes");

const publicContentRoutes = require('./routes/publicContentRoutes');
const adminContentRoutes = require('./routes/adminContentRoutes');

const { adminRouter } = require("./routes/adminAuth");
const adminDataRoutes = require("./routes/adminData");

const app = express();
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend's development server URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Add any other custom headers if needed
  credentials: true // Keep this if your admin panel or other features need it
}));
app.use(express.json());

app.use(express.json({ limit: '10mb' })); // For parsing application/json
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// API Routes
app.use("/api/enroll", enrollRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/contact", contactRoutes);


app.use("/api/admin/auth", adminRouter);         // Login route
app.use("/api/dashboard", adminDataRoutes);


app.use('/api/public/content', publicContentRoutes); // For client-facing website
app.use('/api/admin/cms', adminContentRoutes);


app.get('/api/public/content/courses-list-for-nav', (req, res) => {
  console.log('<<<< DEBUG: Direct route in server.js for /api/public/content/courses-list-for-nav HIT! >>>>');
  res.json({ message: "Direct route in server.js is working!" });
});





// For local testing only (skip this in Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

app.get("/check", (req, res) => {
  res.json("hello world");
});


module.exports = app;