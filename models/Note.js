var mongoose = require("mongoose");

//built in Schema constructor
var Schema = mongoose.Schema;

//make new schema for a NoteSchema object
var NoteSchema = new Schema({
    note: String
});

//make model using schema
var Note = mongoose.model("Note", NoteSchema);

//export model
module.exports = Note;