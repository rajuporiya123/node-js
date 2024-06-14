const mongoose = require('mongoose')

const store = new mongoose.Schema(
    {
        name:String,
        city:String,
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    },
    {
        timestamps:true
    }
)
module.exports = mongoose.model("Store",store)