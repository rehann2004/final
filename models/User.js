// ===== models/User.js =====
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  coreSubjects: {
    computerNetwork: { type: Boolean, default: false },
    cloudComputing: { type: Boolean, default: false },
    nlp: { type: Boolean, default: false },
    cnLab: { type: Boolean, default: false },
    minorProject: { type: Boolean, default: false },
    palr: { type: Boolean, default: false }
  },
  electives: {
    embeddedSystem: { type: Boolean, default: false },
    blockchainLedgers: { type: Boolean, default: false },
    computationalMedicine: { type: Boolean, default: false },
    edgeComputing: { type: Boolean, default: false },
    securityOperations: { type: Boolean, default: false }
  },
  electiveCount: {
    type: Number,
    default: 0
  },
  registrationComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
