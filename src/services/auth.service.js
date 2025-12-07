const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { prisma } = require('../lib/prisma')

async function signupUser({ name, email, password }) {
  const existing = await prisma.food.findUnique({ where: { email } })
  if (existing) {
    const err = new Error('User exists')
    err.code = 'USER_EXISTS'
    throw err
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  return prisma.food.create({
    data: { name, email, password: hashedPassword }
  })
}

async function loginUser({ email, password }) {
  const user = await prisma.food.findUnique({ where: { email } })
  if (!user) {
    const err = new Error('User not found')
    err.code = 'USER_NOT_FOUND'
    throw err
  }
  const ok = bcrypt.compareSync(password, user.password)
  if (!ok) {
    const err = new Error('Password incorrect')
    err.code = 'PASSWORD_INCORRECT'
    throw err
  }
  const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: '7d' })
  const refresh_token = jwt.sign({ email: user.email }, process.env.refresh_SECRET_KEY, { expiresIn: '30d' })
  return { token, refresh_token }
}

module.exports = { signupUser, loginUser }
