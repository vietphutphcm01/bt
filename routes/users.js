var express = require('express');
const { token } = require('morgan');
var router = express.Router();
var userControllers = require('../controllers/users');
let jwt = require('jsonwebtoken');
let { check_authentication, check_authorization } = require("../utils/check_auth");
const constants = require('../utils/constants');


router.get('/', check_authentication, check_authorization(['mod']), async function (req, res, next) {
  try {
    let users = await userControllers.getAllUsers();
    res.send({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
});


router.get('/:id', check_authentication, check_authorization(['mod']), async function (req, res, next) {
  try {
    if (req.user.id === req.params.id) {
      return res.status(403).send({ success: false, message: "Access denied" });
    }
    let user = await userControllers.getUserById(req.params.id);
    res.send({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});


router.post('/', check_authentication, check_authorization(['admin']), async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userControllers.createAnUser(
      body.username,
      body.password,
      body.email,
      body.role
    );
    res.status(200).send({ success: true, message: newUser });
  } catch (error) {
    res.status(404).send({ success: false, message: error.message });
  }
});

router.put('/:id', check_authentication, check_authorization(['admin']), async function (req, res, next) {
  try {
    let body = req.body;
    let updatedUser = await userControllers.updateAnUser(req.params.id, body);
    res.status(200).send({ success: true, message: updatedUser });
  } catch (error) {
    next(error);
  }
});


router.delete('/:id', check_authentication, check_authorization(['admin']), async function (req, res, next) {
  try {
    let deleteUser = await userControllers.deleteAnUser(req.params.id);
    res.status(200).send({ success: true, message: deleteUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;