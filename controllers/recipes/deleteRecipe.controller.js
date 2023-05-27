const db = require("../../models")
const Recipe = db.recipe;
const Image = db.image;

exports.delete = (req, res) => {
    let recipeId = req.params.id;
    if (isNaN(recipeId)) {
        res.status(400).send({
            message: `Recipe id not passed`
        });
        return;
    }

    Recipe.findByPk(recipeId).then(recipe => {
        if (!recipe) {
            res.status(404).send({
                message: `Recipe with id ${recipeId} not found`
            });
            return;
        }

        Image.findByPk(recipe.imageId).then(image => {
           image.destroy();
        });
        recipe.destroy().then(() => {
            res.send({
                message: `Recipe with id ${recipeId} removed`
            });
        });
    })
}