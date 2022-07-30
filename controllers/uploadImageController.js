const Image = require("../models/UploadImage");

exports.UploadImages = async (req, res, next) => {
  try {
    if (!req.file) {
      console.log("error to uploading images");
      return res.status(400).json({
        status: false,
        message: "Image not found",
      }); 
    } else {
     // console.log(req.file);
      console.log(req.body.text)
      const image = new Image({
        imageUrl: req.file.path,
        imageName: req.file.filename,
      });
      await image.save();
      console.log(image)
      return res.status(200).json({
        status: true,
        message: "Image uploaded successfully",
        image: image,
      });
    } 
  } catch (err) {
    return res.status(400).json({
      status: false,
      data: err,
      message: "got some error",
    });
  }
};
