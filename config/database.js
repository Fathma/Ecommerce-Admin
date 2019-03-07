if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: "mongodb://jihad:jihad1234@ds115353.mlab.com:15353/e-commerce_db"
    // mongoURI: "mongodb://jihad:abc1234@ds343985.mlab.com:43985/e-commerce_db_v1"
  };
} else {
  module.exports = {
    mongoURI: "mongodb://jihad:jihad1234@ds115353.mlab.com:15353/e-commerce_db"
    // mongoURI: "mongodb://jihad:abc1234@ds343985.mlab.com:43985/e-commerce_db_v1"
  };
}
