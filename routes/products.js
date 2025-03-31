var express = require('express');
var router = express.Router();
let productSchema = require('../schemas/product');
let categorySchema = require('../schemas/category');
const { authMiddleware, checkRole } = require('../middlewares/auth');


router.get('/', async function (req, res, next) {
  let products = await productSchema.find(BuildQuery(req.query)).populate({
    path: 'category', select: 'name'
  });
  res.status(200).send({
    success: true,
    data: products
  });
});

router.get('/:id', async function (req, res, next) {
  try {
    let product = await productSchema.findById(req.params.id);
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});


router.post('/', authMiddleware, checkRole('mod'), async function (req, res, next) {
  try {
    let { name, price = 0, quantity = 0, category } = req.body;
    let getCategory = await categorySchema.findOne({ name: category });
    if (!getCategory) {
      return res.status(404).send({ success: false, message: "Invalid category" });
    }
    let newProduct = new productSchema({
      name, price, quantity, category: getCategory._id
    });
    await newProduct.save();
    res.status(200).send({ success: true, data: newProduct });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});


router.put('/:id', authMiddleware, checkRole('mod'), async function (req, res, next) {
  try {
    let product = await productSchema.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }
    Object.assign(product, req.body);
    await product.save();
    res.status(200).send({ success: true, data: product });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.delete('/:id', authMiddleware, checkRole('admin'), async function (req, res, next) {
  try {
    let product = await productSchema.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }
    product.isDeleted = true;
    await product.save();
    res.status(200).send({ success: true, data: product });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

module.exports = router;
