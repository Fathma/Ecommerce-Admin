const express = require('express');
const router = express.Router();
const multer = require("multer");
const mongoose = require('mongoose');
const product_controller = require('../controllers/product.controller');

mongoose.Promise = global.Promise;

const upload = multer({
  dest: "../public/photos"
})

// 23/4/2019
router.get("/InhouseInventory", product_controller.getInhouseInventoryPage);
router.get("/DealerInventory", product_controller.getDealerInventoryPage);
router.post("/regiSave", product_controller.SaveProductLP);
router.post("/regiSaveDealer", product_controller.SaveProductDealer);
router.post("/showfields",  product_controller.showProductRegistrationFields);
router.post("/upload",upload.array("imagePath") , product_controller.SaveImage)

// Edit (Inventory With Serial number)
router.get("/stockEditPage/:lot_id/:pid", product_controller.getEditStockPage);
router.get( "/Edit/:id", product_controller.getEditpage );
router.post( "/EditAddOne/:lot_id/:pid", product_controller.editAddNew );
router.post( "/EditReplace/:lot_id/:pid", product_controller.EditReplace );
router.post( "/EditDelete/:lot_id/:pid", product_controller.EditDelete );
router.post( "/EditPP/:lot_id/:pid", product_controller.EditPP );
// router.get("/newLot", product_controller.newLot);

// Edit (Inventory Without Serial number)
router.get("/stockEditNoSerialPage/:lot/:pid", product_controller.stockEditNoSerialPage);
router.post("/stockEditNoSerial/:lot/:pid", product_controller.stockEditNoSerial);

// views
router.get("/view", product_controller.getAllProducts);
router.get("/Online", product_controller.getOnlineProductsPage);
router.get("/offline", product_controller.getOfflineProductsPage);
router.get("/viewLowLive", product_controller.lowLiveQuantityDetails);
router.post("/getProductBySubcatNoSL/:sub_cat", product_controller.getProductBySubcatNoSerial);
router.post("/getProductByCatNoSL/:cat", product_controller.getProductByCatNoSerial);
router.get("/getProductBySubcatNoSL/:sub_cat", product_controller.getProductBySubcatNoSerial);
router.get("/getProductByCatNoSL/:cat", product_controller.getProductByCatNoSerial);
router.get("/getProductBySubcat_filter/:sub_cat", product_controller.getProductBySub_filter);
router.get("/getProductBySubcat/:sub_cat", product_controller.getProductBySubcat);
router.post("/getProductBySubcat/:sub_cat", product_controller.getProductBySubcat);
router.get("/getProductByCat/:cat", product_controller.getProductByCat);
router.post("/getProductByCat/:cat", product_controller.getProductByCat);
router.get("/StockLowToHigh", product_controller.StockLowToHigh);
router.get("/StockHighToLow", product_controller.StockHighToLow);
router.get("/getProductByCat_filter/:cat", product_controller.getProductByCat_filter);
router.get("/viewStock/:id", product_controller.viewStock);
router.get("/stockInfo/:id", product_controller.stockInfo);
router.get("/viewProducts", product_controller.viewProducts);


// validation
router.get("/check_availablity/:model", product_controller.check_availablity);


// Save
// router.post("/regiSave", upload.single("imagePath"), product_controller.SaveProduct);
// router.post("/SaveImage",upload.single("x"), product_controller.SaveImage);


router.post("/saveLive/:id", product_controller.saveLive);

// live
router.get("/liveStockEdit/:id/:pid", product_controller.getLiveStockEditpage);
router.get("/liveStockEditNoSerial/:id/:pid", product_controller.getLiveStockEditNoSerialpage);
router.get("/RestoreLivepage/:id", product_controller.getRestoreLivepage);
router.get("/RestoreLiveNoserialPage/:id", product_controller.RestoreLiveNoserialPage);
router.post("/Restore/:id", product_controller.getRestoreLive);

// router.post("/update/:pid/:feat_num", upload.single("image"), product_controller.update_product);

router.post("/search", product_controller.getSearchResult);
router.get("/active/:id", product_controller.makeActive);
router.get("/unactive/:id", product_controller.makeNotActive);


// // save single image in folder
// const upload = multer({
//   dest: "../public/photos"
 
// });
// router.post(
//   "/upload",
//   upload.single("imagePath" /* name attribute of <file> element in your form */),
//   async (req, res) => {
//     const tempPath = req.file.path;
   
//     await crypto.randomBytes(16, (err, buf) => {
//       if (err) {
//         return reject(err);
//       }
//       filename = buf.toString('hex') + path.extname(req.file.originalname);
//       const targetPath = path.join(__dirname, "../public/photos/"+filename);
   
//       fs.rename(tempPath, targetPath, err => {
//         if (err) console.log(err);

//         res
//           .status(200)
//           .contentType("text/plain")
//           .end("File uploaded!");
//       });
//     });
//   }
// );

module.exports = router;
