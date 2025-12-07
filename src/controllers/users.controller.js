const {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../services/users.service')

async function list(req, res) {
  try {
    const data = await listUsers()
    return res.status(200).json({ data })
  } catch (e) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

async function get(req, res) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid id' })
    const item = await getUserById(id)
    if (!item) return res.status(404).json({ message: 'User not found' })
    return res.status(200).json({ data: item })
  } catch (e) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

async function create(req, res) {
  try {
    const created = await createUser(req.body)
    return res.status(201).json({ data: created })
  } catch (e) {
    if (e.code === 'P2002') return res.status(422).json({ message: 'Email already in use' })
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

async function update(req, res) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid id' })
    const updated = await updateUser(id, req.body)
    return res.status(200).json({ data: updated })
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ message: 'User not found' })
    if (e.code === 'P2002') return res.status(422).json({ message: 'Email already in use' })
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

async function remove(req, res) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid id' })
    await deleteUser(id)
    return res.status(204).send()
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ message: 'User not found' })
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

module.exports = { list, get, create, update, remove }
