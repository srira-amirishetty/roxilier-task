const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String },    
  rating: { type: Number, default: 0 },
  overallRating: { type: Number, default: 0 },
  userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
      }
});

module.exports = mongoose.model('Store', storeSchema);