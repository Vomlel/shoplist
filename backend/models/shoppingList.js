const mongoose = require('mongoose')

const shoppingListSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true
 },
 ownerId: {
    type: String,
    required: true
 },
 usersId: {
    type: Array,
    required: false
 },
 items: [{
   name: {
     type: String,
     required: true
   },
   quantity: {
     type: Number,
     required: true
   }
 }]
})

module.exports = mongoose.model('ShoppingList', shoppingListSchema)