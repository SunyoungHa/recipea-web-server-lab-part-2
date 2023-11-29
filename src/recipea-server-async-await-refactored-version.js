const express = require("express");
const fs = require("fs").promises;

const app = express();

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
})

app.use(express.json());

const getRecipes = async () => {
  const recipes = await fs.readFile("../data/recipea-data.json", "utf8");

  return recipes;
};

const getRecipe = async (id) => {
  const data = await fs.readFile("../data/recipea-data.json", "utf8");

  return JSON.parse(data)[id];
};

const deleteRecipe = async (id) => {
  const data = await fs.readFile("../data/recipea-data.json", "utf8");
  const recipes = JSON.parse(data).filter((recipe, i) => i !== id);
  const jsonRecipes = JSON.stringify(recipes, null, 2);
  await fs.writeFile("../data/recipea-data.json", jsonRecipes);
};

app.get("/find-recipes", async (req, res) => {
  const recipes = await getRecipes();
  res.send(recipes);
});

app.get("/find-recipe/:id", async (req, res) => {
  const id = Number(req.params.id);
  const recipe = await getRecipe(id);
  const jsonRecipe = JSON.stringify(recipe, null, 2);
  res.send(jsonRecipe);
});

app.get("/trash-recipe/:id", async (req, res) => {
  const id = Number(req.params.id);
  await deleteRecipe(id);
  res.send("Recipe with " + id + " has been deleted.");
});


{/* <pre>Cannot GET /new-recipe</pre> */}

app.post("/new-recipe", async (req, res) => {
  const newRecipe = req.body;
  const recipes = await getRecipes();
  recipes.push(newRecipe);
  await saveRecipes(recipes);
  res.send("New recipe has been added.");
});