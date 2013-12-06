// JavaScript Document PetriDish main, by pablo cr. TO DO: genome and phylogeny line visualization, antibiotics, different success rates among strains

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
var mutationOdds = 100; // 1/n chance of mutation per letter
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

function getDistance(x1, y1, x2, y2) { // find distance between two points
	var dist = Math.round(Math.sqrt(Math.pow((x1 - x2)/5.5, 2) + Math.pow(y1 - y2, 2))); //altered x coordinates to make buttons wide
	return dist;
}

function Bug(stuffome, X, Y, color) { // class conctructor
	bugArray.push(this); // add to bugArray
	this.stuffome = stuffome;
	this.energy = startEnergy;
	this.X = X;
	this.Y = Y;
	this.color = color;
	this.eat = function () { // Eat
		if (energyPool >= 2) { // if enough resources
			energyPool = energyPool - 2; // subtract from pool
			this.energy = this.energy + 2; // add to bug
		}
	};
	this.die = function () { // Die
		//energyPool = energyPool + 5; // TO DO: does dying add more resources?
		var position = bugArray.indexOf(this);
		bugArray.splice(position, 1); // remove from bugArray
		this.stuffome = null; // remove properties
		this.energy = null;
		this.X = null;
		this.Y = null;
	};
	this.reproduce = function () { // reproduce
		var preStuffome = this.stuffome.split(""); // array storing all letters
		var newStuffome = ""; // stores new stuffome string
		var mutated = false; // tells whether a mutation occured
		var newColor = this.color; // stores new color
		for (var i=0; i<preStuffome.length; i++) { // loop through preStuffome
			var randomNum = Math.floor(Math.random()*mutationOdds);
			if (randomNum === 0) { // if random number is correct
				var randomLetter = alfabeto[Math.floor(Math.random()*alfabeto.length)];
				if (preStuffome[i] !== randomLetter) {
					preStuffome[i] = randomLetter; // replace this letter with new
					mutated = true; // say this bug is mutant
				}
			}
			newStuffome = newStuffome + preStuffome[i]; // add letter to newStuffome
		}
		
		var newX = this.X + Math.floor(Math.random()*6*bugRadius - 3*bugRadius); // choose new location
		var newY = this.Y + Math.floor(Math.random()*6*bugRadius - 3*bugRadius);
		while (getDistance(newX, newY, centerX, centerY) > centerX-7) { // if outside of petri dish
			newX = this.X + Math.floor(Math.random()*6*bugRadius - 3*bugRadius); // try again
			newY = this.Y + Math.floor(Math.random()*6*bugRadius - 3*bugRadius);
		}
		
		if (mutated) { // if new bug is mutant
			//console.log(newStuffome);
			newColor = "#"; // give it a new color
			var letters = '0123456789ABCDEF'.split('');
			for (var j=0; j<6; j++) {
				newColor += letters[Math.round(Math.random()*15)];
			}
		}
		
		var daughter = new Bug(newStuffome, newX, newY, newColor); // make new bug
		this.energy = startEnergy; // set this one's energy to startEnergy
	};
	this.onEnterFrame = function () { // every new frame
		this.energy = this.energy - 1; // consume energy
		var synStuffome = this.stuffome; // stores synonym stuffome to compare against surviveSeq
		synStuffome.replace("A", "B"); // replaces all letters with thir basic synonyms
		synStuffome.replace("C", "D");
		synStuffome.replace("E", "F");
		synStuffome.replace("G", "H");
		synStuffome.replace("I", "J");
		synStuffome.replace("K", "K");
		synStuffome.replace("M", "N");
		synStuffome.replace("P", "O"); // AL REVÉS! pa que quede COMEPAPA y no CPMEOAOA :)
		synStuffome.replace("Q", "R");
		synStuffome.replace("T", "S"); // también al revés
		if (synStuffome.search(surviveSeq) >= 0) { // if the synonym has the survival sequence
			this.eat(); // eat
		}
		if (this.energy >= reproductionEnergy) { // if enough energy
			this.reproduce(); // reproduce
		}
		if (this.energy <= 0) { // if no energy
			this.die(); // die
		}
		else { // if not dead
			ctx.beginPath(); // draw bug
			ctx.arc(this.X, this.Y, bugRadius, 0, 2*Math.PI, false);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#00BB33';
			ctx.stroke();
		}
	};
}

function mainLoop() {
	if (!killSwitch) { // if killswitch off
		// Draw petri dish//console.log("Bugs: " + bugArray.length + ". Energy Pool: " + energyPool);
		ctx.beginPath();
		ctx.arc(centerX, centerY, centerX - 5, 0, 2*Math.PI, false);
		ctx.fillStyle = '#00FFDD';
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = '#99DDDD';
		ctx.stroke();
		
		// loop through all bugs for life functions, drawing
		for (var i=0; i<bugArray.length; i++) {
			if (killSwitch) {
				break;
			}
			else {
				bugArray[i].onEnterFrame();
			}
		}
		
		// Replenish energyPool
		energyPool = Math.round(energyPool*energyPoolReplenish*10)/10;
		
		graphInfo.push([bugArray.length, energyPool]); // stores population and resource levels in this turn/frame
		if (graphInfo[graphInfo.length-1][0] > graphInfo[graphInfo.length-2][0]) {
			maxBugs = graphInfo[graphInfo.length-1][0];
		}
		if (graphInfo[graphInfo.length-1][1] > graphInfo[graphInfo.length-2][1]) {
			maxResources = graphInfo[graphInfo.length-1][1];
		}
		
		if (!killSwitch) {
			gLoop = setTimeout(mainLoop, 1000/10); // loop the main loop
		}
	}
}

function graph() { // draw population and resource graphs
	ctx.fillStyle = "#FFFFFF"; // erase stage
	ctx.fillRect(0, 0, centerX*2, centerY*2);
	
	ctx.lineWidth = 2;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	
	ctx.strokeStyle = '#FF0000'; // draw population curve
	ctx.beginPath();
	for (var i=1; i<graphInfo.length; i++) {
		ctx.moveTo((i-1)*centerX*2/graphInfo.length, (graphInfo[i-1][0]*(centerY*2)/maxBugs)*(-1) + centerY*2); // move line from last point...
		ctx.lineTo(i*centerX*2/graphInfo.length, (graphInfo[i][0]*(centerY*2)/maxBugs)*(-1) + centerY*2); // ...to next
	}
	ctx.stroke();
	
	ctx.strokeStyle = '#339900'; // draw resources curve
	ctx.beginPath();
	for (var j=1; j<graphInfo.length; j++) {
		ctx.moveTo((j-1)*centerX*2/graphInfo.length, (graphInfo[j-1][1]*(centerY*2)/maxResources)*(-1) + centerY*2);
		ctx.lineTo(j*centerX*2/graphInfo.length, (graphInfo[j][1]*(centerY*2)/maxResources)*(-1) + centerY*2);
	}
	ctx.stroke();
	
	ctx.fillStyle = '#000000'; // write scale
	ctx.fillText("Total time: " + graphInfo.length, 10, 40);
	ctx.fillStyle = '#339900';
	ctx.fillText("Max resources: " + maxResources, 10, 10);
	ctx.fillStyle = '#FF0000';
	ctx.fillText("Max population: " + maxBugs, 10, 25);
}

function flipKillSwitch() { // when killswitch clicked
	killSwitch = !killSwitch; // flip killSwitch
	if (killSwitch) {
		document.getElementById('killSwitchBtn').value = "Killswitch on";
		graph();
	}
	else {
		document.getElementById('killSwitchBtn').value = "Killswitch off";
		ctx.fillStyle = "#FFFFFF"; // erase stage
		ctx.fillRect(0, 0, centerX*2, centerY*2);
		mainLoop();
	}
}

function init() {
	if (!killSwitch) {
		flipKillSwitch();
	}
	else {
		//reset vars
		energyPool = 100000;
		bugArray = [];
		graphInfo = [[1, energyPool]];
		maxResources = energyPool;
		maxBugs = 1;
		
		ctx.fillStyle = "#FFFFFF"; // erase stage
		ctx.fillRect(0, 0, centerX*2, centerY*2);
		
		var luca = new Bug("NNNNEICOMEPAPITA", centerX, centerY, '#00CC77'); // First bug
		
		killSwitch = false;
		document.getElementById('killSwitchBtn').value = "Killswitch off";
		mainLoop();
	}
}

init();