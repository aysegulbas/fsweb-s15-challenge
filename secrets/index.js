const HASH_ROUND = 12;
const JWT_SECRET=process.env.JWT_SECRET||"cilolata_cips"
module.exports = {
  HASH_ROUND,JWT_SECRET
};
