"use strict";


// Song List Display Area
var songArray = [];

// Read from local JSON file with an XHR on page load
function loadUpMySongsFromFirebase() {
    $.ajax({
        url: `https://callan-music-history.firebaseio.com/songs/.json`
    }).done(function(data){
        let musicItems = data;
        $.each(musicItems, function(index, musicItems) {
            addASong(musicItems);
        });
    });
}

function loadUpMySongsFromFirebaseNew(myKey) {
    $.ajax({
        url: `https://callan-music-history.firebaseio.com/songs/${myKey}.json`
    }).done(function(data){
        let musicItems = data;
        addASong(musicItems);
    });
}

loadUpMySongsFromFirebase();

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



// Cycles through each item in the song array and adds it to the DOM
function addToDom(songArray){
    let buildString = "";
    for (let i = 0; i < songArray.length; i++) {
        buildString += `<section data-songposition=${i}>`;
        buildString += `<h2> ${songArray[i].name} </h2>`;
        buildString += `<ul class='song'>`;
        buildString += `<li> ${songArray[i].artist}</li>`;
        buildString += `<li> ${songArray[i].album} </li>`;
        buildString += `<li> ${songArray[i].genre} </li>`;
        buildString += `<button class="btn deleteButton"> <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>  Delete</button>`;
        buildString += `</ul> </section>`;
    }
    $("#songList").html (buildString);
    addEventListenerToDeleteButton();
}

//Enables Event Handler to Delete Song Button as they are added to the DOM
function addEventListenerToDeleteButton() {
    $(".deleteButton").click(deleteSong);
}

//Removes the parent (song) of the delete button from the songlist
function deleteSong(e) {
    var songPosition = $($(e).closest("section")[0]).data("songposition");
    songArray.splice(songPosition, 1);
    addToDom(songArray);
}


// Grabs input from addSong page and creates an array
$("#addSong").click(createNewSongArray);

function createNewSongArray() {
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
    addASongToDatabase(newSongObject);
    clearFields();
}

function clearFields() {
    $("#addSongName").val("");
    $("#addArtist").val("");
    $("#addAlbum").val("");
}

function addASongToDatabase(newSongObject) {
    $.ajax({
    type: "POST",
    url: `https://callan-music-history.firebaseio.com/songs/.json`,
    data: newSongObject,
    }).done(function(data){
        loadUpMySongsFromFirebaseNew(data.name);
        listMusicView();
    });
}

//Adds new song array to full song list of arrays
function addASong(newSongArray) {
    songArray.unshift(newSongArray);
    addToDom(songArray);
}