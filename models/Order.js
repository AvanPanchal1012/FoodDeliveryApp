const mongoose=require('mongoose');
const Restaurant = require('./Restaurant');
const order=mongoose.Schema({
    dishId:String,
    userId:String,
    restaurantId:String,
    time:String,
    photo:String,
    dname:String,
    price:Number,
    quantity:Number,
    paymentType:String,
    states:String,
    user:Object,


})
module.exports=mongoose.model("orders",order)