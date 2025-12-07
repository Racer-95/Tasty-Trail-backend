const { signupUser, loginUser } = require('../services/auth.service')

async function signup(req, res) {
  const { name, email, password } = req.body
  try {
    const result = await signupUser({ name, email, password })
    return res.status(201).json({ message: 'User Create Successfully!' })
  } catch (err) {
    if (err.code === 'USER_EXISTS') {
      return res.status(422).json({ message: 'User Already exists' })
    }
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

async function login(req, res) {
  const { email, password } = req.body
  try {
    const { token, refresh_token } = await loginUser({ email, password })
    return res.status(200).json({ token, email, refresh_token })
  } catch (err) {
    if (err.code === 'USER_NOT_FOUND') {
      return res.status(422).json({ message: 'User does not exists' })
    }
    if (err.code === 'PASSWORD_INCORRECT') {
      return res.status(401).json({ message: 'Password is incorrect.' })
    }
    return res.status(500).json({ message: 'Something wrong' })
  }
}

module.exports = { signup, login }
