const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js");



// REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
})


// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne(
            {
                userName: req.body.username
            }
        );

        !user && res.status(401).json("Wrong user name")

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

        const password = hashedPassword.toString(CryptoJS.enc.Utf8);

        password !== req.body.password && res.status(401).json("wrong password")

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router