const mongoose = require('mongoose');

const homestaySchema = new mongoose.Schema({
  homestayId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  owner: { type: String, required: true },
  ownerMob: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model('Homestay', homestaySchema);
