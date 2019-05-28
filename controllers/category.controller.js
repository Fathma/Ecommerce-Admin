// author: Fathma siddique
// description: the file has all the category related controllers/ functions
const Brand = require('../models/brand.model')
const subCategory = require('../models/subCategory.model')
const Cat = require('../models/category.model')

// saving category
exports.addCategory = (req, res) => {
  req.body.subCategories= []
  req.body.brands= []
  new Cat(req.body).save().then( category => res.send({}))
}

// Saving Sub Category
exports.addSubCategory = (req, res) => {
  var subcategory = {
    name: req.body.subCat,
    category: req.body.cate,
    brands: []
  }
  new subCategory( subcategory ).save().then( subcategory => {
    if ( req.body.cate != 'null') {
      Cat.findOneAndUpdate(
        { _id: req.body.cate },
        { $addToSet: { subCategories: subcategory._id } },
        { upsert: true },
        function( err, docs ) {
          if ( err ) { res.send( err ) }
          res.send({})
        }
      )
    } else {
      res.send({})
    }
  })
}

// Saving Brand
exports.addBrand = ( req, res ) => {
  var brand = { name: req.body.brand }
  new Brand( brand ).save().then( brand => res.send({}))
}

// getting sub categories on the basis of category
exports.getSub2 = ( req, res ) => {
  Cat.find({ name: req.params.cat })
    .populate('subCategories')
    .populate('brands')
    .exec(( err, docs )=> res.json( docs ))
}

// getting sub categories on the basis of category
exports.getSub = (req, res) => {
  Cat.find({ _id: req.params.cat })
    .populate('subCategories')
    .populate('brands')
    .exec(( err, docs )=> res.json( docs ))
}

// returns subcategories of and given subcategories 
exports.getBrand = ( req, res )=>{
  subCategory.find({ name: req.params.subcat })
  .populate('brands')
  .exec(( err, docs )=> res.json( docs ))
}

// returns subcategories of and given subcategories 
exports.getBrand2 = ( req, res )=>{
  Cat.find({ name: req.params.cat })
  .populate('brands')
  .exec((err, docs)=> res.json(docs))
}

