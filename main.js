"use strict"
// Song List Display Area
var addButton = document.getElementById("addSong");
var moreMusic = document.getElementById("moreButton");

var songArray = [];

// Read from local JSON file with an XHR on page load
$.get("songs1.json", function(data){
    let musicItems = data.songs;
    $.each(data.songs, function(index, musicItems) {
        addASong(musicItems);
    })
})

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
    let buildString = ""
    for (let i = 0; i < songArray.length; i++) {
        buildString += `<section>`;
        buildString += `<h2> ${songArray[i]["name"]} </h2>`;
        buildString += `<ul class='song'>`;
        buildString += `<li> ${songArray[i]["artist"]}</li>`;
        buildString += `<li> ${songArray[i]["album"]} </li>`;
        buildString += `<li> ${songArray[i]["genre"]} </li>`;
        buildString += `<button class='btn deleteButton'>Delete</button>`;
        buildString += `</ul> </section>`;
    }
    $("#songList").html (buildString);
    addEventListenerToDeleteButton();
}

//Enables Event Handler to Delete Song Button as they are added to the DOM
function addEventListenerToDeleteButton() {
    $(".deleteButton").click(deleteSong)
}

//Removes the parent (song) of the delete button from the songlist
function deleteSong(e) {
    let child = $(e.target).parent().parent();
    $(child, "#songList").remove();
}


// Grabs input from addSong page and creates an array
$("#addButton").click(createNewSongArray)

function createNewSongArray() {
    let songInput = $("#addSongName").value;
    let artistInput = $("#addArtist").value;
    let albumInput = $("#addAlbum").value;
    let newSongArray = [songInput, artistInput, albumInput]
    addASong(newSongArray);
    clearFields();
}

function clearFields() {
    $("#addSongName").value = "";
    $("#addArtist").value = "";
    $("#addAlbum").value = "";
}


//Adds new song array to full song list of arrays
function addASong(newSongArray) {
    songArray.push(newSongArray);
    addToDom(songArray);
}

//When the user clicks the MORE button, load the songs from the second JSON file and append them to the bottom of the existing music, but before the More button.
$("#moreButton").click(loadNextJson);


function loadNextJson(e) {
    $.get("songs2.json", function(data){
        let musicItems2 = data.songs;
        $.each(data.songs, function(index, musicItems2) {
            addASong(musicItems2);
        })
    });
};

        // songList.classList.add("overflow");
