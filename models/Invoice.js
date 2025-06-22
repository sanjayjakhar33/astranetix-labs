const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  clientName: String,
  clientCompany: String,
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
  gst: Number,
  grandTotal: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Invoice', invoiceSchema);
