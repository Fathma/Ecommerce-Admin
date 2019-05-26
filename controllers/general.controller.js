const allFuctions = require('../functions/allFuctions')

// get low quantity for notification
exports.lowLiveQuantity=async (req, res, next) => {
    var condition = { 'live.quantity': { $lt: 3 }, isActive: true }
    let docs = await allFuctions.get_live(condition)
    var count= 0
    if( docs.length != 0 ) count++
    res.json({ quantity: docs.length, count: count })
  }

// get dashboard 
exports.showDashboard =async (req, res, next) => {
    let docs = await allFuctions.get_live({ 'live.quantity': { $lt:3 }, isActive: true })
    res.render('general/dashboard', { lowlive: docs.length, data: docs })
}