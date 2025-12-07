const { prisma } = require('../lib/prisma')

async function listRecipes() {
  return prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

async function getRecipeById(id) {
  return prisma.recipe.findUnique({ where: { id } })
}

async function createRecipe(data) {
  const payload = {
    title: data.title,
    description: data.description,
    ingredients: data.ingredients,
    steps: data.steps,
    cusine: data.cusine,
    category: data.category,
    likes: typeof data.likes === 'number' ? data.likes : 0,
    cookTime: data.cookTime,
    imageUrl: data.imageUrl,
    authorId: data.authorId ?? null
  }
  return prisma.recipe.create({ data: payload })
}

async function updateRecipe(id, data) {
  const payload = {}
  const fields = ['title','description','ingredients','steps','cusine','category','likes','cookTime','imageUrl','authorId']
  for (const key of fields) {
    if (data[key] !== undefined) payload[key] = data[key]
  }
  return prisma.recipe.update({ where: { id }, data: payload })
}

async function deleteRecipe(id) {
  return prisma.recipe.delete({ where: { id } })
}

module.exports = { listRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe }
