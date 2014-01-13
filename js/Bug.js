// JavaScript Document, Bug Class

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
		synStuffome = synStuffome.replace("B", "A"); // replaces all letters with their basic synonyms
		synStuffome = synStuffome.replace("D", "C");
		synStuffome = synStuffome.replace("F", "E");
		synStuffome = synStuffome.replace("H", "G");
		synStuffome = synStuffome.replace("J", "I");
		synStuffome = synStuffome.replace("L", "K");
		synStuffome = synStuffome.replace("N", "M");
		synStuffome = synStuffome.replace("P", "O");
		synStuffome = synStuffome.replace("R", "Q");
		synStuffome = synStuffome.replace("T", "S");

		for (var k=0; k<surviveSeq.length; k++) { // for every survival sequence
			if (synStuffome.search(surviveSeq[k]) >= 0) { // if the synonym has the survival sequence
				this.eat(); // eat
			}
		}
		for (var l=0; l<killSeq.length; l++) { // for every survival sequence
			if (synStuffome.search(killSeq[l]) >= 0) { // if the synonym has the survival sequence
				this.energy = 0; // consume energy
			}
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