const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "server/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const imageFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    //reject file
    cb(new Error("please upload file with jpeg or png extension"), false);
  }
};
function getExt(filename) {
  var idx = filename.lastIndexOf(".");
  // handle cases like, .htaccess, filename
  return idx < 1 ? "" : filename.substr(idx + 1);
}
const excelFilter = (req, file, cb) => {
 
  let extension = getExt(file.originalname);
  let listOfExtensions = ["xlsx", "xltx", "xls","csv"];
  
  if (listOfExtensions.includes(extension)) {
    cb(null, true);
  } else {
    //reject file
    cb(new Error("please upload valid Excel file"), false);
  }
};
var uploadImage = multer({ storage: storage, fileFilter: imageFilter });
var uploadExcel = multer({ storage: storage, fileFilter: excelFilter });
var upload = multer({ storage: storage });

exports.upload = upload;
exports.uploadImage = uploadImage;
exports.uploadExcel = uploadExcel;