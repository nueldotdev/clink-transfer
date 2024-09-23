const crypto = require('crypto');

// Function to create token and set expiration
function generateVerificationToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenExpires = Date.now() + 3600000; // Token expires in 1 hour
  return { token, tokenExpires };
}

module.exports = { generateVerificationToken };