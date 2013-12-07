// JavaScript Document, graph functions

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