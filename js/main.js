// JavaScript Document PetriDish main, by pablo cr. TO DO: genome and phylogeny line visualization, antibiotics, different success rates among strains

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

function graphBtnHandler() { // when killswitch clicked
	killSwitch = !killSwitch; // flip killSwitch
	if (killSwitch) {
		document.getElementById('graphBtn').value = "Hide graph";
		graph();
	}
	else {
		document.getElementById('graphBtn').value = "Show graph";
		ctx.fillStyle = "#FFFFFF"; // erase stage
		ctx.fillRect(0, 0, centerX*2, centerY*2);
		mainLoop();
	}
}

function restart() {
	killSwitch = true;
	energyPool = 100000;
	bugArray = [];
	graphInfo = [[1, energyPool]];
	maxResources = energyPool;
	maxBugs = 1;
	
	ctx.fillStyle = "#FFFFFF"; // erase stage
	ctx.fillRect(0, 0, centerX*2, centerY*2);
	
	// Draw petri dish
	ctx.beginPath();
	ctx.arc(centerX, centerY, centerX - 5, 0, 2*Math.PI, false);
	ctx.fillStyle = '#00FFDD';
	ctx.fill();
	ctx.lineWidth = 5;
	ctx.strokeStyle = '#99DDDD';
	ctx.stroke();
	
	var luca = new Bug("NNNNEICOMEPAPITA", centerX, centerY, '#00CC77'); // First Bug
	
	gLoop = setTimeout(init, 1000/10); // pause before starting (fixes restart bug)
}

function init() {
	killSwitch = false;
	document.getElementById('graphBtn').value = "Show graph";
	mainLoop();
}

restart();