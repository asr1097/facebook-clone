const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const folderName = `public/images/${req.user.id}`;
        if(fs.existsSync(path.join(__dirname, `../${folderName}`))) {cb(null, folderName)}
        else {fs.mkdir(path.join(__dirname, `../${folderName}`), (err) => {
            if(err) {console.log(err)}
            cb(null, folderName)
        })}
    },
    filename: function(req, file, cb) {
        const name = `${uuidv4()}${path.extname(file.originalname)}`;
        req.image = name;
        cb(null, name);
    }
});

const maxSize = 5 * 1024 * 1024;

const multerFields = [
    {
        name: "imageField",
        maxCount: 1
    },
  
    {
        name: "postID",
        maxCount: 1
    },
  
    {
        name: "user",
        maxCount: 1
    },
  
    {
        name: "text",
        maxCount: 1
    },
  
    {
        name: "id",
        maxCount: 1
    },
  
    {
        name: "name",
        maxCount: 1
    },
  
    {
        name: "notifs",
        maxCount: 1
    },
  
    {
        name: "readMessages",
        maxCount: 1
    }
];

exports.multerUpload = multer({
    storage: storage,
    limits: {fileSize: maxSize}
});

exports.multerFields = multerFields;