//const bcrypt = require('bcrypt')
const bcrypt = require('../app.js').bcrypt
const jwt = require('jsonwebtoken')
const { JWT_SIGN } = require('../config/jwt')

const getAllUser = async (req, res) => {
    try{
        const user = await req.db.collection('users').find().toArray()

        res.status(200).json({
            message: 'User successfully created',
            data: user
        })
    }catch(error){
        res.status(400).json({ error: error.message })        
    }
}

const register = async (req, res) => {
    const { username, email, password, role } = req.body

    try{
        const user = await req.db.collection('users').findOne({ username })

        if (user){
            throw new Error ('Username already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await req.db.collection('users').insertOne({ username, password: hashedPassword, email, role })
        res.status(200).json({
            message: 'User successfully registered',
            data: newUser
        }) 

        }catch (error){
       res.status(400).json({ error: error.message }) 	
    }
}

const login = async (req, res) => {
    const { username, password } = req.body
    const user = await req.db.collection('users').findOne({ username })

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (isPasswordCorrect){
        const token = jwt.sign({ username: user.username, id: user._id, role: user.role }, 'my_sign')
        res.status(200).json({
            message: 'User successfully logged in',
            data: token
        })
    }else{
        res.status(400).json({ error: 'Password is incorrect'})
    }
}


module.exports = {
    register,
    login,
    getAllUser
}
