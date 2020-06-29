const Pipeline = require("../model/pipeline");

exports.addPipeline = (req, res, next) => {
  var pipeline = new Pipeline({
    groupId: req.body.group_ID,
    lanes: [
      {
        title: "new",
        label: "2/2",
      },
      {
        title: "qualified ",
        label: "0/0",
      },
      {
        title: "proposition",
        label: "0/0",
      },
      {
        title: "won",
        label: "0/0",
      },
    ],
  });

  pipeline
    .save()
    .then(() => {
      return res.status(201).json({
        status: 201,
        message: "pipeline created!",
        pipelineID: pipeline._id,
        pipeline: pipeline,
      });
    })
    .catch((err) => {
      if (err) {
        res.status(404).json({ status: 404, message: err });
      }
    });
};
