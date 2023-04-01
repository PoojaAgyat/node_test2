const mongoose = require("mongoose");
const express = require("express");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = new express.Router();

// sign up route
router.post("/signup", async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).json({
                status: "error",
                message: "no login or password, or they are not a strings",
            });
        }
        const oldUser = await User.find({ login: login });
        const hashPassword = await bcrypt.hash(password, 10);
        const saveUser = new User({
            login: login,
            password: hashPassword,
        });
        const data = await saveUser.save()
        return res.status(200).json({
            status: "success",
            data: data,
        });

    } catch (e) {
        return res.status(400).json({
            status: "error",
            message: e.message,
        });
    }
});

// log in route 
router.post("/signin", async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).json({
                status: "error",
                message: "no login or password, or they are not a strings",
            });
        }
        const loginUer = await User.find({ login:login });
        const isValid = await bcrypt.compare(
            password,
            loginUer[0].password
        );
        const token = jwt.sign({ ...loginUer[0] }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });
        return res.status(200).json({
            status: "success",
            token: token,
        });

    } catch (e) {
        return res.status(400).json({
            status: "error",
            message: e.message,
        });
    }
})

module.exports = router;