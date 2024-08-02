const mongoose = require("mongoose");
const itemCatSchema = new mongoose.Schema({
  catName: {
    type: String,
  },
  subCats: [
    {
      subCatName: {
        type: String,
      },
    },
  ],
});
const ItemCat = mongoose.model("ItemCat", itemCatSchema);

module.exports = ItemCat;
