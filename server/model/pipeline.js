const mongoose = require("mongoose");
const pipelineSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
  },
  lanes: [
    {
      id: { type: mongoose.Schema.Types.ObjectId },
      title: {
        type: String,
        max: 50,
        required: true,
      },
      label: {
        type: String,
        max: 50,
        required: true,
      },
      cards: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "deal",
        },
      ],
    },
  ],
});

module.exports = mongoose.model("pipeline", pipelineSchema);
