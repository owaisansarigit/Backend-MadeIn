const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const connectDB = require("./Utils/connectDB");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use("/api/items", require("./Routes/itemRoutes"));
app.use("/api/customer", require("./Routes/customerRoutes"));
app.use("/api/bom", require("./Routes/BOMRoutes"));
app.use("/api/cip", require("./Routes/CIPRoutes"));
app.use("/api/itemscat", require("./Routes/itemCatRoutes"));
app.use("/api/company", require("./Routes/companyRoutes"));
app.use("/api/dimension", require("./Routes/dimensionRoutes"));
app.use("/api/warehouse", require("./Routes/warehouseRoutes"));
app.use("/api/purchase", require("./Routes/purchaseRoutes"));
app.use("/api/sales", require("./Routes/salesRoutes"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "MadeIn server is running" });
});
connectDB(process.env.MONGO_URI);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
