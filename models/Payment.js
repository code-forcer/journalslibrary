const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  payerName: String,
  payerEmail: String,
  amount: Number,
  currency: String,
  title: String,
  paperid: String,
  transactionId: String,
  paymentStatus: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', PaymentSchema);
