const db = require("../../models")
const Recipe = db.recipe;
const User = db.user;
const Ingredient = db.ingredient;
const Comment = db.comment;

exports.get = (req, res) => {
    let recipeId = req.params.id;
    if (isNaN(recipeId)) {
        res.status(400).send({
            message: `Recipe id not passed`
        });
        return;
    }
    //['author', 'ingredients', 'comments', 'ingredients.author']
    Recipe.findByPk(recipeId, {
        include: [
            {
                model: User,
                as: 'author',
                attributes: ['id', 'username', 'firstName', 'lastName']
            },
            {
                model: Ingredient,
                as: 'ingredients',
                attributes: {
                    exclude: ['updatedAt', 'recipeId']
                }
            },
            {
                model: Comment,
                as: 'comments',
                attributes: {
                    exclude: ['updatedAt', 'recipeId', 'authorId']
                },
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['id', 'username', 'firstName', 'lastName']
                    }
                ]
            }
        ],
        attributes: {
            exclude: ['updatedAt', 'authorId']
        }
    }).then(recipe => {
        if (!recipe) {
            res.status(404).send({
                message: `Recipe with id ${recipeId} not found`
            })
            return;
        }
        res.send(recipe);
    });
}