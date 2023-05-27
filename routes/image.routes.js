const {authJwt} = require("../middleware");
const getImage = require("../controllers/images/getImage.controller");
module.exports = function(app) {
    app.get(
        "/api/images/:id",
        getImage.get
    );
};