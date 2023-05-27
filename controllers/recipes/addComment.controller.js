const db = require("../../models")
const Recipe = db.recipe;
const Comment = db.comment;

exports.addComment = (req, res) => {
    let recipeId = req.params.id;
    if (isNaN(recipeId)) {
        res.status(400).send({
            message: `Recipe id not passed`
        });
        return;
    }
    let authorId = req.userId;
    let comment = req.body;
    let error = validateComment(comment, res);
    if (error) {
        return;
    }
    Recipe.findByPk(recipeId).then(recipe => {
        if (!recipe) {
            res.status(404).send({
                message: `Recipe with id ${recipeId} not found`
            });
            return true;
        }

        return false;
    }).then(error => {
        if (error) {
            return 999;
        }
        return Comment.count({
            where: { recipeId: recipeId }
        })
    }).then(count => {
        if (count === 5) {
            res.status(404).send({
                message: `Recipe already has 5 comments`
            });
            return true;
        }
        return count > 5;

    }).then(error => {
        if (error) {
            return;
        }
        Comment.create({
            content: comment.content,
            recipeId: recipeId,
            authorId: authorId
        }).then(comment => {
            res.send({
                commentId: comment.id
            })
        })
    })
}

function validateComment(comment, res) {
    if (!comment.content) {
        res.status(400).send({
            message: "Content is not passed"
        });
        return true;
    }
}