const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema(
  {
    coinId: { 
        type: String, 
        required: true 
    },
    price: {
         ype: Number, 
        required: true 
    },
    marketCap: { 
        type: Number,
        required: true 
    },
    change24h: { 
        type: Number, 
        required: true 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coin", coinSchema);
