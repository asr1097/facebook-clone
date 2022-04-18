const express = require('express');
const router = express.Router();
const { custom, body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

router.post("/", [
    body("email").isEmail().escape().trim().withMessage("Email is not valid.")
        .custom(async value => {
            let emailCheck = await User.findOne({"email": value});
            if (emailCheck !== null) {
                return Promise.reject()
            }
    }).withMessage("Email already exists."),
    body("password").isLength({min: 8}).withMessage("Password is not valid."),
    body("firstName").trim().escape().isLength({min: 2}).withMessage("First name is not valid."),
    body("lastName").trim().escape().isLength({min: 2}).withMessage("Last name is not valid."),
    body("address").trim().escape().isLength({min: 1}).withMessage("Address is incorrect"),
    body("dateOfBirth").toDate(),
    async (req, res) => {
        let errors = await validationResult(req);
        let user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            dateOfBirth: req.body.dateOfBirth
        });
        if(!errors.isEmpty()) {
            res.json({errors: errors.array()});
        }else {
            user.save()
            .then(doc => {res.json("User registered.")})
            .catch(err => {res.json({err})})
        };
    }
]);

module.exports = router;