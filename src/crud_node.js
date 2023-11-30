// import required module
// create an express application
// define the path of data File
// middleware to parse incoming JSON requests
// start server
// get all recipes
// get a specific recipe by id
// delete a recipe by id
// route to get all recipe
// route to get a specific recipe by id
// send the recipe as a Json response
// route to delete a specific recipe by id
// send the deleted recipe as a Json response
// add and update data


// importing the module (a package of pre-written code)
const express = require("express");
const fs = require("fs").promises;

const app = express();
const dataFilePath = "/Users/sunshine/Desktop/recipea-web-server-lab-part-2/data/recipea-data.json";


// used to bind and listen to connection on the host and port. 
app.listen(3000, () => {
  console.log("Recipe API is now listening on http://localhost:3000");
});

// to parse incoming requests with json payloads.
app.use(express.json());

const getAllRecipes = async () => {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data file:", error.message);
    return [];
  }
};

// this function accesses all recipes in the data fileURLToPath.
// const getAllRecipes = async () => {
//     const recipes = await fs.readFile("data/recipea-data.json", "utf8" );
//     return recipes;
//    };
  

// simulating database in json file
const getRecipe = async (id) => {
  const recipes = await getAllRecipes();
  return recipes[id];
};


 // this function accesses one recipe in the data.
 
//  const getRecipe = async(id)=>{
//      const data = await fs.readFile("data/recipea-data.json", "utf8");
//      return JSON.parse(data)[id]
//  }



const deleteRecipe = async (id) => {
  const recipes = await getAllRecipes();
  const deletedRecipe = recipes.splice(id, 1)[0];
  await fs.writeFile(dataFilePath, JSON.stringify(recipes, null, 2), "utf8");
  return deletedRecipe;
};


// this function accesses one recipe in the data for deletion.
// parse is turning json into js
// const deleteRecipe = async(id) => {
//     const data = await fs.readFile("data/recipea-data.json", "utf8");
// const receipes = JSON.parse(data).filter((recipe,i)=>i !=id);
// const jsonRecipes = JSON.stringify(recipes,null,2);
// await fs.writeFile("data/recipea-data.json",jsonRecipes);
// }


// const addRecipe = async (recipe) => {
//   const recipes = await getAllRecipes();
//   recipes.push(recipe);
//   await fs.writeFile(dataFilePath, JSON.stringify(recipes, null, 2), "utf8");
//   return recipe;
// };

// create a helper function.
const addRecipe = async(name,cookingMethod, ingredients)=>{
  const recipeArray = await fs.readFile(dataFilePath, "utf8");
  const receipeList = JSON.parse(recipeArray);
  const newRecipe = {name:name,cookingMethod:cookingMethod, ingredients:ingredients}
  receipeList.push(newRecipe);
  const jsonAddRecipes = JSON.stringify(receipeList,null,2);
  await fs.writeFile(dataFilePath, jsonAddRecipes);
}

const saveRecipe = async(newRecipe)=>{
  const data = await fs.readFile(dataFilePath, "utf8");
  const recipe = [...JSON.parse(data), newRecipe];
  const jsonVersion = JSON.stringify(recipe,null,2);
  await fs.writeFile(dataFilePath, jsonVersion);
}

const updateRecipe = async (id, updatedRecipe) => {
  const recipes = await getAllRecipes();
  recipes[id] = updatedRecipe;
  await fs.writeFile(dataFilePath, JSON.stringify(recipes, null, 2), "utf8");
  return updatedRecipe;
};

app.get("/find-recipes", async (req, res) => {
  const recipes = await getAllRecipes();
  res.send(JSON.stringify(recipes, null, 2));
});

// app.get("/find-recipes", async (req,res)=> {
//     const recipes = await getAllRecipes();
//     res.send(recipes);
// })



app.get("/find-recipe/:id", async (req, res) => {
  const recipe = await getRecipe(Number(req.params.id));
  res.send(JSON.stringify(recipe, null, 2));
});

app.get("/trash-recipe/:id", async (req, res) => {
  const deletedRecipe = await deleteRecipe(Number(req.params.id));
  res.send(JSON.stringify(deletedRecipe, null, 2));
});

// app.post("/create-recipe", async (req, res) => {
//   await saveRecipe(req.body.name, req.body.cookingMethod, req.body.ingredients);
//   res.status(201).json("You added a new recipe!")
// });

app.post("/add-recipe", async (req, res) => {
  try {
    const { name, cookingMethod, ingredients } = req.body;
    const addedRecipe = await addRecipe(name, cookingMethod, ingredients);
    res.status(201).json({ message: "Recipe added successfully", recipe: addedRecipe });
  } catch (error) {
    console.error("Error adding recipe:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Route to handle updating a recipe by id using HTTP PUT method
app.put("/update-recipe/:id", async (req, res) => {
  // Extracting the recipe ID from the request parameters
  const recipeId = Number(req.params.id);

  // Extracting the updated recipe data from the request body
  const updatedRecipe = req.body;

  // Calling the updateRecipe function to update the recipe in the data
  const result = await updateRecipe(recipeId, updatedRecipe);

  // Sending the updated recipe as a JSON response with indentation for readability
  res.send(JSON.stringify(result, null, 2));
});