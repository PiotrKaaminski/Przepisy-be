const db = require("../../models")
const Recipe = db.recipe;
const Ingredient = db.ingredient
const Image = db.image

exports.add = (req, res) => {
    let recipe = JSON.parse(req.body.recipe);
    let image = req.files[0];
    let error = validate(recipe, image, res);
    if (error) {
        return;
    }
    let authorId = req.userId;

    Image.create({
        image: image.buffer,
        mimeType: image.mimetype
    }).then(image => {
        return Recipe.create({
            name: recipe.name,
            type: recipe.type,
            difficulty: recipe.difficulty,
            prepareMinutes: recipe.prepareMinutes,
            description: recipe.description,
            authorId: authorId,
            imageId: image.id
        })
    }).then(dbRecipe => {
        recipe.ingredients.forEach(i => i.recipeId = dbRecipe.id);
        Ingredient.bulkCreate(recipe.ingredients)
        return dbRecipe;
    }).then((dbRecipe) => {
        res.send({
            recipeId: dbRecipe.id
        })
    });
}

function validate(recipe, image, res) {
    if (!recipe.name) {
        res.status(400).send({
            message: "Name is not passed"
        });
        return true;
    }
    if (!recipe.type) {
        res.status(400).send({
            message: "Type is not passed"
        });
        return true;
    }
    if (!db.RECIPE_TYPES.includes(recipe.type)) {
        res.status(400).send({
            message: "Type does not exist = " + recipe.type + ". Allowed values: " + db.RECIPE_TYPES
        });
        return true;
    }
    if (!recipe.difficulty) {
        res.status(400).send({
            message: "Difficulty is not passed"
        });
        return true;
    }
    if (!db.RECIPE_DIFFICULTY.includes(recipe.difficulty)) {
        res.status(400).send({
            message: "Difficulty does not exist = " + recipe.difficulty + ". Allowed values: " + db.RECIPE_DIFFICULTY
        });
        return true;
    }
    if (!recipe.prepareMinutes) {
        res.status(400).send({
            message: "Prepare minutes is not passed"
        });
        return true;
    }
    if (isNaN(recipe.prepareMinutes)) {
        res.status(400).send({
            message: "Prepare minutes is not a number"
        });
        return true;
    }
    if (recipe.prepareMinutes < 1) {
        res.status(400).send({
            message: "Prepare minutes is less than 1"
        });
        return true;
    }
    if (!recipe.description) {
        res.status(400).send({
            message: "Description is not passed"
        });
        return true;
    }
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        for (let i = 0; i < recipe.ingredients.length; i++) {
            let ingredient = recipe.ingredients[i];
            if (!ingredient.name) {
                res.status(400).send({
                    message: "Ingredient " + (i+1) + " name is not passed"
                });
                return true;
            }
            if (!ingredient.amount || isNaN(ingredient.amount) || ingredient.amount < 1) {
                res.status(400).send({
                    message: "Ingredient " + (i+1) + " amount is less than 1"
                });
                return true;
            }
            if (!ingredient.unit) {
                res.status(400).send({
                    message: "Ingredient " + (i+1) + " unit is not passed"
                });
                return true;
            }
            if (!db.INGREDIENT_UNIT.includes(ingredient.unit)) {
                res.status(400).send({
                    message: "Ingredient " + (i+1) + " unit does not exist = " + ingredient.unit + ". Allowed values: " + db.INGREDIENT_UNIT
                });
                return true;
            }
        }
    } else {
        res.status(400).send({
            message: "No ingredients passed"
        });
        return true;
    }
    if (!image) {
        res.status(400).send({
            message: "No image passed"
        });
        return true;
    }
    return false;
}

