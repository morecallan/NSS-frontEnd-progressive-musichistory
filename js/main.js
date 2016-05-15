"use strict";


/********************************************
**            NAVIGATION - VIEWS           **
********************************************/
//Add event listeners for navigation tabs
$("#addMusicViewButton").click(addMusicView);
$("#listMusicViewButton").click(listMusicView);

function addMusicView() {
    $("#listMusicView").addClass("hidden");
    $("#addMusicView").removeClass("hidden");
    $("#addMusicView").addClass("visible");
    //Add active class to add music tab, remove it from view music tab
    $("#addMusicViewButton").addClass("active");
    $("#listMusicViewButton").removeClass("active");
}

function listMusicView() {
    $("#listMusicView").removeClass("hidden");
    $("#addMusicView").addClass("hidden");
    $("#addMusicView").removeClass("visible");
    //Add active class to view music tab, remove it from add music tab
    $("#addMusicViewButton").removeClass("active");
    $("#listMusicViewButton").addClass("active");
}



/********************************************
**          DATABASE INTERACTION           **
********************************************/
function loadUpMySongsFromFirebase() {
    $.ajax({
        url: `https://callan-music-history.firebaseio.com/songs/.json`
    }).done(function(data){
        $("#songList").html("");
        $.each(data, function(index, data) {
            populateDOM(index, data);
        });
    });
}

function deleteSongsFromFirebase(myKey) {
    $.ajax({
        url: `https://callan-music-history.firebaseio.com/songs/${myKey}/.json`,
        type: "DELETE"
    }).done(function(data){
        loadUpMySongsFromFirebase();
    });
}

function addASongToFirebase(newSongObject) {
    $.ajax({
    type: "POST",
    url: `https://callan-music-history.firebaseio.com/songs/.json`,
    data: newSongObject,
    }).done(function(data){
        loadUpMySongsFromFirebase();
        listMusicView();
    });
}

//Initiates load from database on page load
loadUpMySongsFromFirebase();




/********************************************
**          POPUATING DATA - DOM           **
********************************************/
// Cycles through each item in the song object and adds it to the DOM
function populateDOM(index, song){
    let buildString = "";
    buildString += `<section data-songkey=${index}>`;
    buildString += `<h2> ${song.name} </h2>`;
    buildString += `<ul class='song'>`;
    buildString += `<li> ${song.artist}</li>`;
    buildString += `<li> ${song.album} </li>`;
    buildString += `<li> ${song.genre} </li>`;
    buildString += `<button class="btn deleteButton"> <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>  Delete</button>`;
    buildString += `</ul> </section>`;
    $("#songList").append(buildString);
    addEventListenerToDeleteButton();
}


/********************************************
**              DELETING A SONG            **
********************************************/
//Enables Event Handler to Delete Song Button as they are added to the DOM
function addEventListenerToDeleteButton() {
    $(".deleteButton").click(deleteSong);
}

//Removes the parent (song) of the delete button from the songlist
function deleteSong(e) {
    var songPosition = $($(this).closest("section")[0]).data("songkey");
    deleteSongsFromFirebase(songPosition);
}


// Grabs input from addSong page and creates an array
$("#addSong").click(createNewSongObject);

function createNewSongObject() {
    let songInput = $("#addSongName").val();
    let artistInput = $("#addArtist").val();
    let albumInput = $("#addAlbum").val();
    let genreInput = "sampleGenre";
    let newSongObject = JSON.stringify({
      "name": songInput,
      "artist": artistInput,
      "album": albumInput,
      "genre": genreInput
    });
    addASongToFirebase(newSongObject);
    clearFields();
}

function clearFields() {
    $("#addSongName").val("");
    $("#addArtist").val("");
    $("#addAlbum").val("");
}