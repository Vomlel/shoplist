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
 itemsId: {
    type: Array,
    required: false
 }
})

module.exports = mongoose.model('ShoppingList', shoppingListSchema)