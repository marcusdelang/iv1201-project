const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const { find: findUser } = require('../model/User')

const saltRounds = 10;

router.post('/', async (req, res) => {
    console.log(req.headers);
    const { username, password } = req.body
    const foundUser = await findUser(username)
    if (!foundUser.verifyPassword(password)) {
        return res.status(401).send()
    }

    bcrypt.hash(`${username}:${password}`, saltRounds, function (err, hash) {
        res.send({
            auth: hash,
            user: foundUser.serialize()
        })
    });
})

module.exports = router
