// Grab the articles as a json
console.log("running app.js");




// Whenever someone clicks a button
$(document).on("click", ".modalToggler", function() {
  // Save the id from the button
  let thisId = $(this).attr("data-id");
  let modalId = $(this).attr("data-target");
  let commentsId = thisId+"Comments";
  $(modalId).modal("show");


  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(data => {


      const latestNote = data.notes.length - 1;
      console.log("get id "+data.notes[latestNote]._id);
      $("#"+commentsId).append(newNote(data.notes[latestNote].note, data.notes[latestNote]._id));
    })
});

//make a new note card
function newNote(string, id){
  console.log("newNote id: "+id);
  const card = $("<div>").addClass("card").attr("data-card",id);
  const cardbody = $("<div>").addClass("card-body");
  const button = $("<button>").addClass("close delete float-right ").attr("data-id",id).append("x");
  cardbody.append(string).append(button);
  card.append(cardbody);
  return card;
}

// When you click the savenote button
$(document).on("click", ".saveNote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  var noteId = thisId+"noteInput";

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      note: $("#"+noteId).val().trim()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#"+noteId).val("");
});

//when you delete a note
$(document).on("click", ".delete", function(){
  const thisId = $(this).attr("data-id");
  // console.log(thisId);
  $("[data-card='"+thisId+"']").remove();


})