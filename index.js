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

//? userSchema
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
});

// productModel
const productModel = mongoose.model("products", productSchema);

//? userModel
const userModel = mongoose.model("users", userSchema);

// get product
app.get("/", async (req, res) => {
  const products = await productModel.find();
  // res.json(products);
  res.render("index", { products });
});

//? get user
app.get("/user", async (req, res) => {
  const users = await userModel.find();
  res.render("index2", { users });
})

// add product
app.get("/add", (req, res) => {
  res.render("add");
});

//? add user
app.get("/adduser", (req, res) => {
  res.render("add2");
});

// save product
app.post("/save", async (req, res) => {
  const body = req.body;
  const result = await productModel.create(body);
  res.redirect("/");
  // res.json({ message: "Product created" });
});

//? save user
app.post("/saveuser", async (req, res) => {
  const body = req.body;
  const result = await userModel.create(body);
  res.redirect("/user");
  // res.json({ message: "Product created" });
});

// edit product
app.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const product = await productModel.findOne({ _id: id });
  res.render("edit", { product });
});

//? edit user
app.get("/:id/edituser", async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findOne({ _id: id });
  res.render("edit2", { user });
});

// save-product
app.post("/:id/save-product", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  await productModel.findByIdAndUpdate(id, body);
  res.redirect("/");
});

//? save-user
app.post("/:id/save-user", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  await userModel.findByIdAndUpdate(id, body);
  res.redirect("/user");
});

// delete product
app.get("/:id/delete", async (req, res) => {
  const id = req.params.id;
  await productModel.findByIdAndDelete(id);
  res.redirect("/");
});

//? delete user
app.get("/:id/deleteuser", async (req, res) => {
  const id = req.params.id;
  await userModel.findByIdAndDelete(id);
  res.redirect("/user");
});

startServer();
