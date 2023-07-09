// değişiklik yapmayın
const router = require('express').Router();
const bilmeceler = require('./bilmeceler-data');

router.get('/', (req, res) => {
  res.status(200).json(bilmeceler);
});
router.post("/",(req,res)=>{
  const bilmece={id:Date.now(),bilmece:req.body.bilmece}
  bilmeceler.push(bilmece)
  res.status(201).json(bilmece)
})
module.exports = router;
