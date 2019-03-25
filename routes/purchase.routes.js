const express = require('express');
const router = express.Router();

const purchase = require('../controllers/purchase.controller');

const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const multer = require("multer");

const mongoo = 'mongodb://jihad:jihad1234@ds115353.mlab.com:15353/e-commerce_db';

const conn = mongoose.createConnection(mongoo);
let gfs;
conn.once('open', function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('fs');
})
var filename;
// create storage engine
const storage = new GridFsStorage(
  {
    url: mongoo,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) { return reject(err); }
          filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'fs'
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload = multer({ storage });

// supplier
router.get("/SupplierRegistrationPage", purchase.supplierRegistrationPage);
router.post("/SupplierSave", purchase.supplierSave);
router.get("/SupplierList", purchase.supplierList);
router.get("/Edit/:id", purchase.supplierEditPage);
router.post("/Edit/:id", purchase.supplierEdit);
router.get("/delete/:id", purchase.supplierDelete);
router.get("/localPurchase", purchase.LocalPurchasePage);
router.get("/localPurchase/:invc", purchase.LocalPurchaseLPPage);
router.get("/getContactPerson/:sup", purchase.getContactPerson);

// local Purchase
router.post("/SaveLocalPurchase", purchase.SaveLocalPurchase);


module.exports = router;
