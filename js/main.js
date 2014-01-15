// JavaScript Document PetriDish main, by pablo cr. TO DO: genome and phylogeny line visualization, selective antibiotics

function mainLoop() {
	if (!killSwitch) { // if killswitch off
		historyArray.push([]); // add subarray for new turn in historyArray
		
		for (var i=0; i<bugArray.length; i++) {// loop through all bugs
			bugArray[i].onEnterFrame(); // executes life functions
			historyArray[historyArray.length-1].push(bugArray[i]); // adds bug to this turn's snapshot in historyArray
		}
		
		// Replenish energyPool
		energyPool = Math.round(energyPool*energyPoolReplenish*10)/10;
		if (energyPool > poolMax) { // if energy pool is above the max sustainable yield,
			energyPool = poolMax; // set to the max
		}
		
		graphInfo.push([bugArray.length, energyPool]); // stores population and resource levels in this turn/frame
		if (graphInfo[graphInfo.length-1][0] > maxBugs) { // if population at new high
			maxBugs = graphInfo[graphInfo.length-1][0]; // store this number (for use in graph)
		}
		if (graphInfo[graphInfo.length-1][1] > maxResources) { // if resources at new high
			maxResources = graphInfo[graphInfo.length-1][1]; // store that number
		}
		
		if (viewMode === "petri") {
			drawPetri();
		}
		else if (viewMode === "popul") {
			graphPopul();
		}
		
		if (!killSwitch) {
			gLoop = setTimeout(mainLoop, 1000/fps); // loop the main loop
		}
	}
}

function graphBtnHandler() {
	viewMode = "popul";
	if (killSwitch) {
		document.getElementById("run-pause").value = "Run";
	}
	else {
		document.getElementById("run-pause").value = "Pause";
	}
	graphPopul();
}

function petriBtnHandler() {
	viewMode = "petri";
	if (killSwitch) {
		document.getElementById("run-pause").value = "Run";
	}
	else {
		document.getElementById("run-pause").value = "Pause";
	}
	drawPetri();
}

function strainBtnHandler() {
	viewMode = "strain";
	killSwitch = true;
	document.getElementById("run-pause").value = "Can't run in strain mode";
	graphStrain();
}

function runPause() {
	if (killSwitch) {
		if (viewMode !== 'strain') {
			killSwitch = false;
			document.getElementById("run-pause").value = "Pause";
			mainLoop();
		}
	}
	else {
		killSwitch = true;
		document.getElementById("run-pause").value = "Run";
	}
}

function restart() {
	killSwitch = true;
	document.getElementById("run-pause").value = "Run";
	energyPool = poolStart;
	bugArray = [];
	historyArray = [];
	graphInfo = [[1, energyPool]];
	maxResources = energyPool;
	maxBugs = 1;
	
	ctx.fillStyle = "#FFFFFF"; // erase stage
	ctx.fillRect(0, 0, centerX*2, centerY*2);
	
	var luca = new Bug(startStuffome, centerX, centerY, '#00CC77', '-'); // First Bug
	historyArray.push([luca]); // stores "picture" of population at start
	
	// Draw petri dish
	if (viewMode === "petri") {
		drawPetri();
	}
	else if (viewMode === "popul") {
		graphPopul();
	}
	else if (viewMode === "strain") {
		
	}
	
	gLoop = setTimeout(init, 1000/10); // pause before starting (fixes restart bug)
}

function init() {
	killSwitch = true;
	document.getElementById("run-pause").value = "Run";
	mainLoop();
}

restart();