const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const dbConfig = require("./config/database");
var Category = require("./models/category.model");
var Product = require("./models/Product");
var Supplier = require("./models/supplier.model");
var SubCategory = require("./models/subCategory.model");
var Brand = require("./models/brand.model");
const morgan = require("morgan");
var path = require("path");
var mongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
var HandlebarsIntl = require("handlebars-intl");
var Handlebars = require("handlebars");
var moment = require("moment");
moment().format();
// role
const { ensureAuthenticated } = require("./helpers/auth");
const { Super } = require("./helpers/rolecheck");
const { SuperPublisher } = require("./helpers/rolecheck");
const app = express();

// Load routes controller
const ordersRoutes = require("./routes/orders.routes");
const categoryRoutes = require("./routes/category.routes");
const usersRoutes = require("./routes/users.routes");
const productsRoutes = require("./routes/products.routes");
const customerRoutes = require("./routes/customer.routes");
const invoiceRoutes = require("./routes/invoice.routes");
const purchaseRoutes = require("./routes/purchase.routes");

// Passport config
require("./config/passport")(passport);

// Map global promise
mongoose.Promise = global.Promise;

//DB Connection
mongoose.connect(dbConfig.mongoURI, err => {
  if (!err) console.log("MongoDB connection Established, " + dbConfig.mongoURI);
  else
    console.log("Error in DB connection :" + JSON.stringify(err, undefined, 2));
});

HandlebarsIntl.registerWith(Handlebars);

app.use(morgan("dev"));

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const hbs = handlebars.create({
  defaultLayout: "main",

  helpers: {
    equality: function(value1, value2, block) {
      if (value1 === undefined ||value1 === null || value2 === undefined || value2 === null) {
      } else {
        if (value1.toString() == value2.toString()) {
          return block.fn(true);
        } else return block.inverse(false);
      }
    }
  }
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(methodOverride("_method"));
// Handlebars middleware
// app.engine("handlebars", handlebars({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Express session middleware
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

Handlebars.registerHelper("formatTime", function(date, format) {
  var mmnt = moment(date);
  return mmnt.format(format);
});

app.use(function(req, res, next) {
  Supplier.find().exec(function(err, docs) {
    if (err) return next(err);
    res.locals.Supplier = docs;
    next();
  });
});

app.use(function(req, res, next) {
  Category.find()
    .populate("subCategories")
    .exec(function(err, categories) {
      if (err) return next(err);
      res.locals.S_categories = categories;
      next();
    });
});

// Gloabl variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use(function(req, res, next) {
  Category.find({}, function(err, categories) {
    if (err) return next(err);
    res.locals.cat = categories;
    next();
  });
});

app.use(function(req, res, next) {
  SubCategory.find({}, function(err, categories) {
    if (err) return next(err);
    res.locals.categories = categories;
    next();
  });
});

app.use(function(req, res, next) {
  Brand.find({}, function(err, docs) {
    if (err) return next(err);
    res.locals.brand = docs;
    next();
  });
});

app.use(function(req, res, next) {
  Product.find({}, function(err, docs) {
    if (err) return next(err);
    res.locals.Product = docs;
    next();
  });
});

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

//Port For the Application
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("The server is live on http://127.0.0.1:3000/");
});

app.get("/", (req, res) => {
  if (req.user) {
    res.redirect("/products/showDashboard");
  } else {
    res.redirect("/users/login");
  }
});

// About route
app.get("/about", (req, res) => {
  res.render("about");
});

// Use routes
app.use("/category", categoryRoutes);
app.use("/users", usersRoutes);
app.use("/orders", ordersRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/customers", customerRoutes);
app.use("/products", productsRoutes);
app.use("/purchase", purchaseRoutes);
