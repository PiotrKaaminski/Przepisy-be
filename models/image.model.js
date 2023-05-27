const {Sequelize} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    return sequelize.define("images", {
        image: {
            type: Sequelize.BLOB
        },
        mimeType: {
            type: Sequelize.STRING
        }
    });
}