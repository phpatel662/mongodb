var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;


var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  },
  imgSrc: {
    type: String
  },
  notes: [{
      id: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    },
      note: {
        type: String,
        ref: "Note"
      }
  }]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
