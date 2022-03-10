const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//defining routes
const createRouter = require("./routes/create.router");
app.use("/create", createRouter);
