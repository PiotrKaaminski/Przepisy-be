const db = require("../../models")
const Image = db.image

exports.get = (req, res) => {
    let imageId = req.params.id;
    console.log(imageId)
    if (isNaN(imageId)) {
        res.status(400).send({
            message: `Image id not passed`
        });
        return;
    }
    Image.findByPk(imageId).then(image => {
        if (!image) {
            res.status(404).send({
                message: `Image with id ${imageId} not found`
            });
            return;
        }
        res.contentType(image.mimeType)
            .send(image.image);
    });
}