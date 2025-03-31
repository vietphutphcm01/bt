var express = require('express');
var router = express.Router();
const roleSchema = require('../schemas/role');
const { check_authentication, check_authorization } = require("../utils/check_auth");

router.get('/', async function (req, res, next) {
  try {
    let roles = await roleSchema.find({});
    res.send({
      success: true,
      data: roles
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.post('/', check_authentication, check_authorization(['admin']), async function (req, res, next) {
  try {
    let body = req.body;
    let newRole = new roleSchema({
      name: body.name
    });
    await newRole.save();
    res.status(200).send({
      success: true,
      data: newRole
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
