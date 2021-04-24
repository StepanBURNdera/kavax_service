const jwt = require("jsonwebtoken");
const moment = require("moment")
const { generateHash, verifyHash } = require('../utils/crypto')
const { User } = require('../db/models/user.model');

module.exports = {
    signUpUser: async (userInfo) => {
        try {
            const user = await User.create(generateHash(userInfo))
            const payload = {
                userId: user.getDataValue('id'),
                maxAge: moment().add(15, 'minutes')
            }
            return { success: true, token: jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: 900}) }
        }
        catch (e) {
            return { success: false, error: e }
        }
    },

    logInUser: async (authData) => {
        const user = await User.findOne({ where: { email: authData.email, password: authData.password } })
        const payload = {
            userId: user.getDataValue('id'),
            maxAge: moment().add(15, 'minutes')
        }
        return { success: verifyHash(authData, user.getDataValue('password')), token: jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: 900}) }
    },

    deleteUser: async () => {

    }
}
