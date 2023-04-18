const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const firebaseConfig = require('./firebaseConfig.js');


const PORT = process.env.PORT || 5000;

const app = express();

// Enable cors
app.use(cors());

// Set static folder
app.use(express.static("public"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Mins
  max: 100,
});
app.use(limiter);
app.set("trust proxy", 1);

// Use the API routes
app.use("/api1", require("./routes/api1"));
app.use("/api2", require("./routes/api2"));
app.use("/api3", require("./routes/api3"));
app.use("/api4", require("./routes/api4"));
app.use("/api5", require("./routes/api5"));
// app.use("/api6", require("./routes/api6"));
// app.use("/login", require("./routes/login"));



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
