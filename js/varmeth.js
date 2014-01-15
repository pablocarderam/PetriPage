// JavaScript Document, stores variables and methods used in other js files

// VARS & PARAMETERS
// Stage
var page = document.getElementById("page"), // get div element covering whole page, for mouse and touch events
stage = document.getElementById("stage"), // get canvas element and context
ctx = stage.getContext("2d");
ctx.scale(2, 2); // scale back to full dimensions after oversampling and reduction
centerX = 250; // stores actual values of stage center for reference in this document
centerY = 250;

// Program running
var bugRadius = 8; // radius of circle onscreen
var gLoop; // for looping the main loop
var fps = 5; // framerate in frames per sec
var killSwitch = true;
var viewMode = "petri";

// Reproduction and related
var alfabeto = [
	"A", "B", "C", "D", "E", 
	"F", "G", "H", "I", "J", 
	"K", "L", "M", "N", "O", 
	"P", "Q", "R", "S", "T" 
	]; // stores all possible letters to be used in stuffome. In this case, 20 letters
	// (STUFFOME: simplified version of genome, proteome, metabolome, etc). 
var surviveSeq = ["MO", "CO", "SO"]; // Array with stuffome sequences that allow metabolism, i.e. eat
var killSeq = [];  // Array with antibiotic sequences that block metabolism, i.e. kill
var stuffomeLength = 16; // length of stuffome in each bug
var mutationOdds = 50; // 1/n chance of mutation per letter
var startStuffome = "NNNNNNMOCOSNNNNN"; // stuffome of initial bug

// Energy
var reproductionEnergy = 15; // energy needed for a bug to reproduce 
	//(BUG: individual agent/organism/player/whatev)
var startEnergy = 5; // energy at which bug starts
var poolStart = 150000; // stores starting level of Energy Pool
var poolMax = 200000; // stores "maximum sustainable yield" of the energy pool. Ceiling value.
var energyPool = poolStart; // stores resources on medium. Set to starting value
var energyPoolReplenish = 1.02; // stores factor by which energyPool replenishes. 1 = no replenishment

// Keeping track of things
var bugArray = []; // stores all bugs
var historyArray = []; // stores reference to all bugs ever

var graphInfo = [[1, energyPool]]; // stores population and resource levels for each frame, to be graphed later. Each element in array is [population, resources]
var maxBugs = 1; // stores max values attained in the simulation, used for graph scale
var maxResources = energyPool;


// METHODS
function getDistance(x1, y1, x2, y2) { // find distance between two points
	var dist = Math.round(Math.sqrt(Math.pow((x1 - x2)/5.5, 2) + Math.pow(y1 - y2, 2))); //altered x coordinates to make buttons wide
	return dist;
}

function sortBy(a,b) { 
	return parseFloat(b[1]) - parseFloat(a[1]);
}

function randomColor() {
	var newColor = "#";
	var letters = '0123456789ABCDEF'.split('');
	for (var j=0; j<6; j++) {
		newColor += letters[Math.round(Math.random()*15)];
	}
	return newColor;
}

// Updaters
function updateFps(newVal) {
	fps = newVal;
}

function newSurviveSeq() {
	surviveSeq.push("-"); // add new surviveSeq to array
	var id = surviveSeq.length-1; // stores id that relates this text input area to this sequence
	id.toString();
	
	var i = document.createElement("input"); // creates a new input element for the new survival sequence
	i.setAttribute('type',"text");
	i.setAttribute('value',"TYPE HERE");
	i.setAttribute('id', id);
	i.setAttribute('onchange', "updateSurviveSeq(this.id, this.value)");
	
	document.getElementById('new_survive_seqs').appendChild(i); // adds it to html
}

function newKillSeq() {
	killSeq.push("-"); // add new killSeq to array
	var id = killSeq.length-1; // stores id that relates this text input area to this sequence
	id.toString();
	
	var i = document.createElement("input"); // creates a new input element for the new survival sequence
	i.setAttribute('type',"text");
	i.setAttribute('value',"TYPE HERE");
	i.setAttribute('id', id);
	i.setAttribute('onchange', "updateKillSeq(this.id, this.value)");
	
	document.getElementById('new_kill_seqs').appendChild(i); // adds it to html
}

function updateSurviveSeq(formNum, newVal) {
	//var newVal = newValue;
	//console.log(newValue);
	if (newVal === "") {
		newVal = "-";
	}
	
	newVal = newVal.replace("B", "A"); // replaces all letters with their basic synonyms
	newVal = newVal.replace("D", "C");
	newVal = newVal.replace("F", "E");
	newVal = newVal.replace("H", "G");
	newVal = newVal.replace("J", "I");
	newVal = newVal.replace("L", "K");
	newVal = newVal.replace("N", "M");
	newVal = newVal.replace("P", "O");
	newVal = newVal.replace("R", "Q");
	newVal = newVal.replace("T", "S");
	
	surviveSeq[formNum] = newVal;
}

function updateKillSeq(formNum, newVal) {
	if (newVal === "") {
		newVal = "-";
	}
	
	newVal = newVal.replace("B", "A"); // replaces all letters with their basic synonyms
	newVal = newVal.replace("D", "C");
	newVal = newVal.replace("F", "E");
	newVal = newVal.replace("H", "G");
	newVal = newVal.replace("J", "I");
	newVal = newVal.replace("L", "K");
	newVal = newVal.replace("N", "M");
	newVal = newVal.replace("P", "O");
	newVal = newVal.replace("R", "Q");
	newVal = newVal.replace("T", "S");
	
	killSeq[formNum] = newVal;
}

function updateMutationOdds(newVal) {
	mutationOdds = newVal;
}

function updateStartEnergy(newVal) {
	startEnergy = newVal;
}

function updateRepEnergy(newVal) {
	reproductionEnergy = newVal;
}

function updateStartResources(newVal) {
	poolStart = newVal;
}

function updateResourceReplenishment(newVal) {
	energyPoolReplenish = newVal/100;
}

function updateMaxResource(newVal) {
	poolMax = newVal;
}

function updateStartStuffome(newVal) {
	startStuffome = newVal;
}