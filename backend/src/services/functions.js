require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sendEntryEmail } = require('./mailing');



const secretKey = process.env.JWT_SECRET; // JWT Secret

// Function to create token and set expiration
function generateEntryCode() {
  // const entryCode = crypto.randomBytes(6).toString('hex');
  const entryCode = Math.floor(100000 + Math.random() * 900000);
  const tokenExpires = Date.now() + 3600000; // Token expires in 1 hour
  return { entryCode, tokenExpires };
}


function verifyJWT(token) {    
  if (!token) {
    console.log({ message: 'Authorization token not provided' })
    return res.status(401).json({ message: 'Authorization token not provided' });
  }

  const decoded = jwt.verify(token, secretKey);
  return { decoded };
}

function extractTokens(req) {    
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  return { token };
}




async function assignCode(user) {
  const { entryCode, tokenExpires } = generateEntryCode();
  user.entryCode = entryCode;
  user.tokenExpires = tokenExpires;

  await user.save();

  return true;
}




async function matchKeys(key, hashedKey) {
  const matched = bcrypt.compareSync(key, hashedKey);
  return { matched };
}




const testWord = "the_test";
const hashedWord = bcrypt.hashSync(testWord, 10);

console.log({ test: testWord, hashed: hashedWord });
const findMatch = async () => {
  try {
    const match = await bcrypt.compare(testWord, hashedWord);
    console.log({ test: testWord, hashed: hashedWord, match: match });
  } catch (error) {

  }
}

module.exports = { generateEntryCode, matchKeys, verifyJWT, assignCode };