const express = require("express");
const paymentRouter = require("./routes/payments");
const cors = require("cors");

const app = express();
app.use(express.json({ extended: false }));
app.use(cors());

// route included
app.use("/payment", paymentRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server running on port : " + port);
});
