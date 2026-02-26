import express from "express";
import mongoose from "mongoose";
// npm i express-ejs-layouts
import expressLayouts from "express-ejs-layouts";
const app = express();
app.use(expressLayouts);
app.set("layout", "layout");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// dbConnect
const dbConnect = async () => {
  await mongoose.connect("mongodb://localhost:27017/merndatabase");
};

// startServer
const startServer = async () => {
  await dbConnect();
  app.listen(8080, () => console.log("Server started"));
};

// productSchema
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageurl: { type: String, required: true },
});

// productModel
const productModel = mongoose.model("products", productSchema);

// get
app.get("/", async (req, res) => {
  const products = await productModel.find();
  // res.json(products);
  res.render("index", { products });
});

// add
app.get("/add", (req, res) => {
  res.render("add");
});

// save
app.post("/save", async (req, res) => {
  const body = req.body;
  const result = await productModel.create(body);
  res.redirect("/");
  // res.json({ message: "Product created" });
});

// edit
app.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const product = await productModel.findOne({ _id: id });
  res.render("edit", { product });
});

// save-product
app.post("/:id/save-product", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  await productModel.findByIdAndUpdate(id, body);
  res.redirect("/");
});

app.get("/:id/delete", async (req, res) => {
  const id = req.params.id;
  await productModel.findByIdAndDelete(id);
  res.redirect("/");
});

startServer();
