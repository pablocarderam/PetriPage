// JavaScript Document, graph functions

function graphPopul() { // draw population and resource graphs
	ctx.fillStyle = "#FFFFFF"; // erase stage
	ctx.fillRect(0, 0, centerX*2, centerY*2);
	
	ctx.lineWidth = 2;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	
	ctx.strokeStyle = '#FF0000'; // draw population curve
	ctx.beginPath();
	for (var i=1; i<graphInfo.length; i++) {
		ctx.moveTo((i-1)*centerX*2/graphInfo.length, (graphInfo[i-1][0]*(centerY*2 - ctx.lineWidth)/maxBugs)*(-1) + centerY*2); // move line from last point...
		ctx.lineTo(i*centerX*2/graphInfo.length, (graphInfo[i][0]*(centerY*2 - ctx.lineWidth)/maxBugs)*(-1) + centerY*2); // ...to next
	}
	ctx.stroke();
	
	ctx.strokeStyle = '#339900'; // draw resources curve
	ctx.beginPath();
	for (var j=1; j<graphInfo.length; j++) {
		ctx.moveTo((j-1)*centerX*2/graphInfo.length, (graphInfo[j-1][1]*(centerY*2 - ctx.lineWidth)/maxResources)*(-1) + centerY*2);
		ctx.lineTo(j*centerX*2/graphInfo.length, (graphInfo[j][1]*(centerY*2 - ctx.lineWidth)/maxResources)*(-1) + centerY*2);
	}
	ctx.stroke();
	
	ctx.fillStyle = '#000000'; // write scale
	ctx.fillText("Total time: " + graphInfo.length, 10, 40);
	ctx.fillStyle = '#339900';
	ctx.fillText("Max resources: " + maxResources, 10, 10);
	ctx.fillStyle = '#FF0000';
	ctx.fillText("Max population: " + maxBugs, 10, 25);
}

function drawPetri() {
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
	
	for (var i=0; i<bugArray.length; i++) {
		bugArray[i].draw();
	}
}

function graphStrain() { // draw population and resource graphs
	ctx.fillStyle = "#FFFFFF"; // erase stage
	ctx.fillRect(0, 0, centerX*2, centerY*2);
	
	for (var k=0; k<historyArray.length; k++) { // for every turn
		var stuffomes = [];
		console.log("Turn " + k);
		
		for (var l=0; l<historyArray[k].length; l++) { // for every bug alive in that turn
			//console.log(historyArray[k].length); //TO DO: figure out why
			if (historyArray[k].length <= l) {
				break;
			}
			else {
				for (var m=0; m<stuffomes.length; m++) { // loop through stuffomes listed alive this turn 
					//console.log("Stuffome " + m);
					//if (historyArray[k].length>0) {
						if (historyArray[k][l] === undefined) {
							break;
						}
						if (historyArray[k][l].stuffome === stuffomes[m][0]) { // if any matches this bug's stuffome
							stuffomes[m][1] ++; // add one to that stuffome's count
							//console.log("match found");
							break; // get out of this loop, go to the next bug
						}
						else if (m === (stuffomes.length-1)) { // if no matches found and at the end of the stuffomes array
							stuffomes.push([historyArray[k][l].stuffome, 1, historyArray[k][l].color]); // add this stuffome to the array
							//console.log("Added stuffome "+ historyArray[k][l].stuffome);
							break; // get out of this loop, go to the next bug
						}
					//}
				}
				if (stuffomes.length === 0) { // if stuffome loop was skipped because stuffomes is empty
					if (historyArray[k][l] !== undefined) { // if there were any bugs alive this turn
						stuffomes.push([historyArray[k][l].stuffome, 1, historyArray[k][l].color]); // add this stuffome to the array
						//console.log("Added stuffome "+ historyArray[k][l].stuffome);
					}
				}
			}
		}
		
			//TO DO: figure this shit out: Y scale messes up when population declines???
		
			
		//stuffomes.sort(sortBy); // sort stuffomes according to number of bugs
		//console.log(stuffomes);
		var prevHeight = 0; // stores height of previous stuffomes section for use in the following loop
		//console.log(stuffomes);
		for (var n=0; n<stuffomes.length; n++) {
				ctx.fillStyle = stuffomes[n][2]; // 
				ctx.fillRect((k-1)*centerX*2/historyArray.length, prevHeight, k*centerX*2/historyArray.length, prevHeight+centerY*2*(stuffomes[n][1]/graphInfo[k][0]));
				
				//console.log(prevHeight);
				//ctx.fillRect(100, prevHeight, 200, prevHeight+centerY*2*(stuffomes[n][1]/graphInfo[k][0]));
				prevHeight = prevHeight+centerY*2*(stuffomes[n][1]/graphInfo[k][0]);
				//console.log(prevHeight);
				//console.log(centerY*2*(1-stuffomes[n][1]/stuffomes[0][1]));
			//}
		}
	}
	
	ctx.fillStyle = '#000000'; // write scale
	ctx.fillText("Total time: " + historyArray.length, 10, 40);
	//ctx.fillText("Strain's stuffome: ", 10, 10);
	//ctx.fillText("Strain's % of population: ", 10, 25);
}