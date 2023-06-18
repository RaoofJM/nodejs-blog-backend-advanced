const mongoose = require("mongoose");
const cryptoJs = require("crypto-js");

// Define the schema for the refresh token
const refreshTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: { type: String, required: true },
  deviceIdentifier: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

// Encrypt the token before saving it to the database
refreshTokenSchema.pre("save", function (next) {
  if (!this.isModified("token")) {
    return next();
  }
  try {
    const encrypted = cryptoJs.AES.encrypt(
      this.token,
      process.env.ENCRYPTION_KEY
    ).toString();
    this.token = encrypted;
  } catch (err) {
    return next(err);
  }
  return next();
});

// Decrypt the token when retrieving it from the database
refreshTokenSchema.methods.decrypt = function () {
  try {
    const bytes = cryptoJs.AES.decrypt(this.token, process.env.ENCRYPTION_KEY);
    const decrypted = bytes.toString(cryptoJs.enc.Utf8);
    return decrypted;
  } catch (err) {
    return null;
  }
};

// Create the RefreshToken model
const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = RefreshToken;
