const {
  listRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../services/recipes.service')

async function list(req, res) {
  try {
    const data = await listRecipes()
    return res.status(200).json({ data })
  } catch (e) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

async function get(req, res) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid id' })
    const item = await getRecipeById(id)
    if (!item) return res.status(404).json({ message: 'Recipe not found' })
    return res.status(200).json({ data: item })
  } catch (e) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

async function create(req, res) {
  try {
    const created = await createRecipe(req.body)
    return res.status(201).json({ data: created })
  } catch (e) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

async function update(req, res) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid id' })
    const updated = await updateRecipe(id, req.body)
    return res.status(200).json({ data: updated })
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ message: 'Recipe not found' })
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

async function remove(req, res) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid id' })
    await deleteRecipe(id)
    return res.status(204).send()
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ message: 'Recipe not found' })
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

module.exports = { list, get, create, update, remove }
