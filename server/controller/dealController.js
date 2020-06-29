const Deal = require("../model/deal");
const { dealValidation } = require("../validation");
const addDeal = async (req, res) => {
  const { error } = dealValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let deal = new Deal(req.body);
  let result = await deal.save();
  res.status(200).json(result);
};
exports.addDeal = addDeal;

const getDealsByGroupID = async (req, res) => {
  const deals = await Deal.find({ groupId: req.body.group_id }).populate(
    "companyID"
  );
  if (!deals) return res.status(404).send("not found");
  return res.status(200).json(deals);
};
exports.getDealsByGroupID = getDealsByGroupID;

const changeDealPosition = async (req , res) => {
  console.log(req.body);
  
  const deals = await Deal.findOneAndUpdate(
    { _id: req.body.ID },
    { dealStage: req.body.target }
  );
  if (!deals) return res.status(404).send("not found");
  return res.status(200).json("updated");
}
exports.changeDealPosition = changeDealPosition;