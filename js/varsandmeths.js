// JavaScript Document

var page = document.getElementById("page"), // get div element covering whole page, for mouse and touch events
stage = document.getElementById("stage"), // get canvas element and context
ctx = stage.getContext("2d");
ctx.scale(2, 2); // scale back to full dimensions after oversampling and reduction
centerX = 250; // stores actual values of stage center for reference in this document
centerY = 250;

// Parameters
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
var reproductionEnergy = 10; // energy needed for a bug to reproduce 
	//(BUG: individual agent/organism/player/whatev)
var startEnergy = 5; // energy at which bug starts

var energyPool = 100000; // stores resources on medium. Set to starting value
var energyPoolReplenish = 1; // stores factor by which energyPool replenishes. 1 = no replenishment
var bugArray = []; // stores all bugs

var graphInfo = [[1, energyPool]]; // stores population and resource levels for each frame, to be graphed later. Each element in array is [population, resources]
var maxBugs = 1; // stores max values, used for graph scale
var maxResources = energyPool;

var bugRadius = 8; // radius of circle onscreen

var gLoop; // for looping the main loop
var killSwitch = false;

// METHODS
function getDistance(x1, y1, x2, y2) { // find distance between two points
	var dist = Math.round(Math.sqrt(Math.pow((x1 - x2)/5.5, 2) + Math.pow(y1 - y2, 2))); //altered x coordinates to make buttons wide
	return dist;
}