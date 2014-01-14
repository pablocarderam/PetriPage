// JavaScript Document PetriDish main, by pablo cr. TO DO: genome and phylogeny line visualization, selective antibiotics

function mainLoop() {
	if (!killSwitch) { // if killswitch off
		if (viewMode === "petri") {
			drawPetri();
		}
		else if (viewMode === "popul") {
			graphPopul();
		}
		else if (viewMode === "strain") {
			
		}
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
		
		if (!killSwitch) {
			gLoop = setTimeout(mainLoop, 1000/fps); // loop the main loop
		}
	}
}

function graphBtnHandler() {
	viewMode = "popul";
	graphPopul();
}

function petriBtnHandler() {
	viewMode = "petri";
	drawPetri();
}

function strainBtnHandler() {
	viewMode = "strain";
}

function runPause() {
	if (killSwitch) {
		killSwitch = false;
		document.getElementById("run-pause").value = "Pause";
		mainLoop();
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
	graphInfo = [[1, energyPool]];
	maxResources = energyPool;
	maxBugs = 1;
	
	ctx.fillStyle = "#FFFFFF"; // erase stage
	ctx.fillRect(0, 0, centerX*2, centerY*2);
	
	var luca = new Bug(startStuffome, centerX, centerY, '#00CC77', '-'); // First Bug
	
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