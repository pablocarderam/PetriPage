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
var killSwitch = false;

// Reproduction and related
var alfabeto = [
	"A", "B", "C", "D", "E", 
	"F", "G", "H", "I", "J", 
	"K", "L", "M", "N", "O", 
	"P", "Q", "R", "S", "T" 
	]; // stores all possible letters to be used in stuffome. In this case, 20 letters
	// (STUFFOME: simplified version of genome, proteome, metabolome, etc). 
var surviveSeq = "EICOMEPAPITA"; // stuffome sequence needed to metabolize, i.e. eat
var stuffomeLength = 16; // length of stuffome in each bug
var mutationOdds = 50; // 1/n chance of mutation per letter

// Energy
var reproductionEnergy = 10; // energy needed for a bug to reproduce 
	//(BUG: individual agent/organism/player/whatev)
var startEnergy = 5; // energy at which bug starts
var poolStart = 1000; // stores starting level of Energy Pool
var energyPool = poolStart; // stores resources on medium. Set to starting value
var energyPoolReplenish = 1.07; // stores factor by which energyPool replenishes. 1 = no replenishment

// Keeping track of things
var bugArray = []; // stores all bugs
var graphInfo = [[1, energyPool]]; // stores population and resource levels for each frame, to be graphed later. Each element in array is [population, resources]
var maxBugs = 1; // stores max values attained in the simulation, used for graph scale
var maxResources = energyPool;

// METHODS
function getDistance(x1, y1, x2, y2) { // find distance between two points
	var dist = Math.round(Math.sqrt(Math.pow((x1 - x2)/5.5, 2) + Math.pow(y1 - y2, 2))); //altered x coordinates to make buttons wide
	return dist;
}

// Updaters
function updateFps(newVal) {
	fps = newVal;
}

function updateSurviveSeq(newVal) {
	surviveSeq = newVal;
}

function updateMutationOdds(newVal) {
	mutationOdds = newVal;
}