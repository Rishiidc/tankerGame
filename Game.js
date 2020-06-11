class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    tanker1 = createSprite(300,200);
    tanker1.addImage("tanker1",tanker1_img);
    gun1 = createSprite(300,200);
    gun1.addImage("gun1",gun1_img);
    tanker2 = createSprite(1000,200);
    tanker2.addImage("tanker2",tanker2_img);
    gun2 = createSprite(1000,200);
    gun2.addImage("gun2",gun2_img);
    tanker1.scale = 0.5;
    tanker2.scale = 0.5;
    gun1.scale = 0.5;
    gun2.scale = 0.5;
    cars = [tanker1, tanker2];
    gun = [gun1,gun2];
  }

  play(){
    form.hide();
    
    Player.getPlayerInfo();
    player.getCarsAtEnd()
    if(allPlayers !== undefined){
      background(rgb(198,135,103));
      image(track, 0,-displayHeight*4,displayWidth, displayHeight*5);
      
      //var display_position = 100;
      
      //index of the array
      var index = 0;


      //x and y position of the cars
      var x = 175 ;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 300;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        //cars[index-1].x = x;
        cars[index-1].y = y;
        //gun[index-1].x = x;
        gun[index-1].y = y;
       //console.log(index, player.index)

       
        if (index === player.index){
          stroke(10);
          fill("red");
          //ellipse(x,y,60,60);
          //cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y;
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }
    if (keyIsDown(LEFT_ARROW) && player.index!==null){
      cars[player.index-1].x-=25
      gun[player.index-1].x-=25
    }
    if (keyIsDown(RIGHT_ARROW) && player.index!==null){
      cars[player.index-1].x+=25
      gun[player.index-1].x+=25
    }

    if(player.distance > 4500){
      gameState = 2;
      player.rank+=1
      Player.updateCarsAtEnd(player.rank);
    }
   this.spawnenemies();
   if (tanker1.isTouching(enemygroup)){
      tanker1.destroy();
      gun1.destroy();
   }
   if (tanker2.isTouching(enemygroup)){
    tanker2.destroy();
    gun2.destroy();
 }
 for (var i=0;i<enemygroup.length;i++){

 if (bulletgroup.isTouching(enemygroup[i])){
   console.log("destroy");
  enemygroup[i].destroy();
  Egungroup[i].destroy();
  bulletgroup.destroyEach();
}
 }
    drawSprites();
  }
 spawnenemies(){
   if(World.frameCount%30===0){
     var enemy=createSprite(random(150,displayWidth-150),-displayHeight*5);
     var Egun = createSprite(enemy.x,enemy.y);
     enemy.addImage(enemy_img);
     enemy.rotation=180;
     Egun.rotation = 180;
     enemy.scale = 0.5;
     Egun.scale = 0.5;
     enemy.velocityY=7;
     Egun.addImage(gun1_img);
     Egun.velocityY=7;
     enemygroup.add(enemy);
     Egungroup.add(Egun);
   }
 }
  end(){
    console.log("Game Ended");
    console.log(player.rank);

  }
  bullets(){
    if(World.frameCount%5===0){
      console.log("bullet")
      var bullet = createSprite(gun[player.index-1].x,gun[player.index-1].y,10,10)
      bullet.shapeColor = "blue"
      bullet.velocityY=-10
      bulletgroup.add(bullet)
    }
  }
}
