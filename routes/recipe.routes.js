const multer = require("multer");
const upload = multer();
const { authJwt } = require("../middleware");
const addRecipe = require("../controllers/recipes/addRecipe.controller");
const deleteRecipe = require("../controllers/recipes/deleteRecipe.controller");
const addComment = require("../controllers/recipes/addComment.controller");
const getRecipe = require("../controllers/recipes/getRecipe.controller");
const getRecipeList = require("../controllers/recipes/getRecipeList.controller");

module.exports = function(app) {
    app.post(
        "/api/recipes",
        upload.any(),
        [authJwt.verifyToken, authJwt.isUser],
        addRecipe.add
    );

    app.delete(
        "/api/recipes/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        deleteRecipe.delete
    );

    app.post(
        "/api/recipes/:id/comments",
        [authJwt.verifyToken, authJwt.isUser],
        addComment.addComment
    );

    app.get(
        "/api/recipes/:id",
        getRecipe.get
    );

    app.get(
        "/api/recipes",
        getRecipeList.getList
    );
};