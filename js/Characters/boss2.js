function boss2(x, y) {

	this.x = x;
	this.y = y;

	this.maxHealth = 12; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = undefined;

	this.tileColliderWidth = 14;
	this.tileColliderHeight = 40;
	this.tileColliderOffsetX = 0;
	this.tileColliderOffsetY = 0;

	this.hitboxWidth = 14;
	this.hitboxHeight = 40;
	this.hitboxOffsetX = 0;
	this.hitboxOffsetY = 0;

	this.spriteSheet = sprites.Boss2.idle;
	this.spriteWidth = 70;
	this.spriteHeight = 70;
	this.spriteFrames = 4;
	this.spriteSpeed = 9;
	
	//this.deathSpriteSheet = sprites.Slime.deathAnimation;
	this.deathSpriteFrames = 10;
	this.deathSpriteSpeed = 4;
	var directionTimer = 0;
	var minSpeed = .25;
	var maxSpeed = .50;
	var minMoveTime = 1.5;
	var maxMoveTime = 2.5;
	var musicSwitched = false; //whether or not it has activated the boss music

	this.getRandomNumber;

	var staates = {
		munch : function(){
			if(!this.ticksInState){
				this.sprite.setSprite(sprites.Slime.munch, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					4, this.enemyData.spriteSpeed, false);
				
			}

			if(this.ticksInState == 9){
				muunch(this.x, this.y);
			}

			if(this.sprite.isDone() && this.sprite.getSpriteSheet() != sprites.Slime.idleAnimation){
				this.sprite.setSprite(sprites.Slime.idleAnimation, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					4, this.enemyData.spriteSpeed, true);
			}

			this.sprite.update();
			if(this.ticksInState > 100){
				this.setState("normal")
			}

		},
		derpAround : function() {
			var willWander = Math.random() * 100;
			if(willWander > 20){
				this.setState("wander")
			} else if (willWander < 10) {
				this.setState("normal")
			}
		},
		normal : function(){
			// if(this.maxHealth != this.currentHealth){
			// 	if( Math.abs(this.y - player.y) < 20 ){
			// 		this.setState("munch")
			// 		return;
			// 	}
			// 	if( Math.abs(this.x - player.x) < 20){
			// 		this.setState("munch")
			// 		return;
			// 	}
			// }

			if(mDist(this.x, this.y, player.x, player.y) < 700 && musicSwitched == false){  //Activates boss music
				updateCurrentTracks(true);
				musicSwitched = true;
			}
			
			const dist = mDist(this.x, this.y, player.x, player.y);
			if((dist > 40) && (dist < 250)) {
				this.setState("warp");
				return;
			}

			if(!this.ticksInState){
				directionTimer = minMoveTime + Math.random() * maxMoveTime;
				this.sprite.setSprite(this.enemyData.spriteSheet, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);

			}
			if (directionTimer <= 0 || directionTimer == undefined) {
				this.setState("derpAround")
			}

			this.getRandomNumber = Math.ceil(Math.random() * 100);
			if (this.getRandomNumber > 99) {
				ghast_laugh_SFX.play();
			}

			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		},
		warp: function() {
			if(this.sprite.alpha > 0) {
				this.sprite.alpha = (1 - this.ticksInState / 20);
			} else {
				if(this.sprite.alpha <= 0) {
					const deltaX = -25 + Math.random() * 50;
					const deltaY = -25 + Math.random() * 50;
					this.x = player.x + deltaX;
					this.y = player.y + deltaY;
					this.hitbox.update(this.x, this.y);
					this.tileCollider.update(this.x, this.y);
					this.sprite.alpha = 1;
					this.setState("derpAround");
				}
			}
		},
		dying: function(){
			if(!this.ticksInState){
				// this.sprite.setSprite(sprites.Slime.death,
				// 	this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				// 	10, 15, false);	
			}
			
			// if(this.sprite.isDone()){
				
				// remove from enemy list
				var foundHere = currentRoom.enemyList.indexOf(this);
				if (foundHere > -1) {
					currentRoom.enemyList.splice(foundHere, 1);
				}
				updateCurrentTracks(false);
				
			// }
			this.sprite.update();
		}
	}

	this.deadEvent = function() {
		ga('send', {
		  hitType: 'event',
		  eventCategory: 'Monster',
		  eventAction: 'Defeat',
		  eventLabel: 'SlimeSan',
		});
		this.monsterRef.setState("dying")
		this.monsterRef.isDying = true;		
	} // end of dead
	
	return new enemyClass(this, staates);
}
enemyDictionary["boss2"] = boss2