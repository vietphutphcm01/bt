var express = require('express');
var router = express.Router();
let categorySchema = require('../schemas/category');
const { authMiddleware, checkRole } = require('../middlewares/auth');


router.get('/', async function(req, res, next) {
  let categories = await categorySchema.find({});
  res.status(200).send({
    success: true,
    data: categories
  });
});

router.get('/:id', async function(req, res, next) {
  try {
    let category = await categorySchema.findById(req.params.id);
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

router.post('/', authMiddleware, checkRole('mod'), async function(req, res, next) {
  try {
    let newCategory = new categorySchema({ name: req.body.name });
    await newCategory.save();
    res.status(200).send({ success: true, data: newCategory });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});


router.put('/:id', authMiddleware, checkRole('mod'), async function(req, res, next) {
  try {
    let category = await categorySchema.findById(req.params.id);
    if (!category) {
      return res.status(404).send({ success: false, message: "Category not found" });
    }
    category.name = req.body.name || category.name;
    await category.save();
    res.status(200).send({ success: true, data: category });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.delete('/:id', authMiddleware, checkRole('admin'), async function(req, res, next) {
  try {
    let category = await categorySchema.findById(req.params.id);
    if (!category) {
      return res.status(404).send({ success: false, message: "Category not found" });
    }
    category.isDeleted = true;
    await category.save();
    res.status(200).send({ success: true, data: category });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

module.exports = router;