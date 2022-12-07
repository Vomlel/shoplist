const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true
 },
 amount: {
    type: String,
    required: false
 },
 unit: {
    type: String,
    required: false
 }
})

module.exports = mongoose.model('Item', itemSchema)