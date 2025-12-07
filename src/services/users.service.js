const bcrypt = require('bcrypt')
const { prisma } = require('../lib/prisma')

function sanitize(user) {
  if (!user) return user
  const { password, ...rest } = user
  return rest
}

async function listUsers() {
  const users = await prisma.food.findMany({ orderBy: { createdAt: 'desc' } })
  return users.map(sanitize)
}

async function getUserById(id) {
  const user = await prisma.food.findUnique({ where: { id } })
  return sanitize(user)
}

async function createUser(data) {
  const payload = {
    name: data.name,
    email: data.email,
    password: await bcrypt.hash(data.password, 10)
  }
  const created = await prisma.food.create({ data: payload })
  return sanitize(created)
}

async function updateUser(id, data) {
  const payload = {}
  if (data.name !== undefined) payload.name = data.name
  if (data.email !== undefined) payload.email = data.email
  if (data.password !== undefined) payload.password = await bcrypt.hash(data.password, 10)

  const updated = await prisma.food.update({ where: { id }, data: payload })
  return sanitize(updated)
}

async function deleteUser(id) {
  await prisma.food.delete({ where: { id } })
}

module.exports = { listUsers, getUserById, createUser, updateUser, deleteUser }
