// start slingin' some d3 here.

var gameOptions = {
  height: window.innerHeight-110,
  width: window.innerWidth - 20,
  nEnemies: Math.floor(window.innerHeight / 30),
};

var scoreboard = {
  currentScore : 0,
  highScore : 0,
  collisions : 0
}

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var gameBoard = d3.select('.container').append('svg:svg')
                  .attr('width', gameOptions.width)
                  .attr('height', gameOptions.height)
                  .style('background-image', 'url("rain.jpg")')
                  .html('<defs><pattern id="image" x="0" y="0"> <image x="0" y="0" xlink:href="player.png"></image></pattern></defs>')



  //THIS IS AN ARRAY IDIOTS
  var playerData = [{
   //path : "m254,168c-1,0 -5.089417,-0.086823 -8,3c-8.26091,8.761124 -15.671326,23.536575 -21,46c-10.283386,43.350342 -7,68 -7,102c0,12 0.545212,28.135284 7,49c0.934586,3.021027 3.805649,6.448395 8,8c11.600998,4.291473 25,4 42,4c13,0 40.406189,2.608429 55,-1c9.560944,-2.364014 18.812134,-7.382568 24,-11c5.252319,-3.662384 9.769501,-8.390991 12,-12c1.662506,-2.690002 2.525299,-6.084412 4,-13c1.518311,-7.120026 3,-16 3,-19c0,-17 0,-35 0,-49c0,-25 -0.419189,-35.149048 -3,-44c-3.276489,-11.236755 -6.418518,-18.226273 -9,-24c-3.290771,-7.360077 -6.020538,-14.506638 -10,-21c-4.081085,-6.65918 -7.190582,-10.77977 -13,-16c-5.36377,-4.819763 -11.954681,-7.190887 -20,-9c-9.949585,-2.23732 -25.012085,-3.581818 -39,-3c-12.031189,0.500427 -16.137482,2.216568 -24,4c-3.083939,0.699524 -5,1 -6,1c-1,0 -2,1 -3,1c-1,0 -1.707108,0.292892 -1,1c0.707108,0.707108 2.292892,0.292892 3,1c0.707108,0.707108 1,1 2,1l0,2l1,0l0,0",
   // <line id="svg_9" y2="325" x2="335" y1="294" x1="239" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="5" stroke="#00bf5f" fill="red"/>
   // <line id="svg_10" y2="234" x2="264" y1="214" x1="264" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="5" stroke="#00bf5f" fill="none"/>
   // <line id="svg_11" y2="238" x2="315" y1="217" x1="314" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="5" stroke="#00bf5f" fill="none"/>
   x : 50,
   y : 50,
   r : 35
  }];

  var dragmove = function(d){
    d.y = Math.max(playerData[0].r, Math.min(gameOptions.height - playerData[0].r, d3.event.y));
    d.x = Math.max(playerData[0].r, Math.min(gameOptions.width - playerData[0].r, d3.event.x));
    d3.select(this)
      .attr("cy", d.y)
      .attr("cx", d.x)
      .attr('fill', colors[Math.floor(Math.random()*colors.length)])
  }

  var drag = d3.behavior.drag()
    .on("drag", dragmove);

  var player = gameBoard.selectAll('circle.player')
          .data(playerData, function(d) {return d})
          .enter()
    .append("svg:circle")
    .attr('class', 'player')
    .attr('cx', gameOptions.width/2)
    .attr('cy', function(d) { console.log(this); return gameOptions.height;})
    .call(drag);

    player.transition()
    .duration(3000)
    .attr('cx', function(d){ return axes.x(d.x)})
    .attr('cy', function(d){ return axes.y(d.y)})
    .attr('r', function(d){return d.r})
    .attr('fill', 'red')
    .attr('opacity', .5)
    .attr('stroke', 'black')
    .attr('stroke-width', function(d) { console.log(this); return 4;})






var throttledcollision = _.throttle(function() { scoreboard.collisions++}, 500, {trailing:false});

var checkCollision = function(enemy) {
  var radiusSum = playerData[0].r + parseFloat(enemy.attr('width')/2);
  var xDiff = parseFloat(enemy.attr('x')  - player.attr('cx'));
  var yDiff = parseFloat(enemy.attr('y') - player.attr('cy'));
  var distance = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2))
  //console.log(playerData[0].r, enemy.attr('width'), xDiff, yDiff, distance, radiusSum)
  //console.log("player radiues, enemy rad, xdiff, y diff , distance, radiusSum ")
  if (distance < radiusSum) {
    throttledcollision();
    if(scoreboard.currentScore > scoreboard.highScore){
      scoreboard.highScore = scoreboard.currentScore-1;
    }
    scoreboard.currentScore = 0;
  }
};



var tweenWithCollisionDetection = function(d){
  var enemy = d3.select(this);

  var startPos = {
    x : parseFloat(enemy.attr('x')),
    y : parseFloat(enemy.attr('y'))
  }

  var endPos = {
    x : axes.x(d.x),
    y : axes.y(d.y)
  }

  return function(t){
    checkCollision(enemy);



    var enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x)*t,
      y: startPos.y + (endPos.y - startPos.y)*t
    }

    enemy.attr('x', enemyNextPos.x)
        .attr('y', enemyNextPos.y)
  }
}

var update = function(enemyData){

  //DATA JOIN
  var enemies = gameBoard.selectAll('image.enemy').data(enemyData,function(d){ return d.id });

  //UPDATE  - Data that stayed
  enemies.transition()
    .duration(2000)
    .tween('custom', tweenWithCollisionDetection)

  //ENTER  -- New Data
    enemies.enter().append("svg:image")
      .attr('class', 'enemy')
      .attr('x', function(d){ return axes.x(d.x)})
      .attr('y', function(d){ return axes.y(d.y)})
      .attr('height', 0)
      .attr('width', 0)
      .attr('opacity',.7)
    .transition()
      .duration(1000)
      .attr("height", 40)
      .attr('width', 40)
      .attr('animation-direction', 'normal')
      .attr("xlink:href", function(d) {return 'player.png';})




  //ENTER + UPDATE  -- All Data

  //EXIT -- Nodes that no longer have Data
}

var colors = ['red', 'blue', 'teal', 'orange', 'green', 'purple', 'yellow', 'black', 'white', 'pink'];

var updateScore = function() {
  d3.select('.scoreboard').selectAll("span")
  .data([scoreboard.highScore, scoreboard.currentScore, scoreboard.collisions])
  .text(function(d){ return d});

}

var play = function() {

  var turn = function() {
  //Recalculate Data
    var enemyData = _.range(0,gameOptions.nEnemies).map(function(value) {
      return {
        id: value,
        x: Math.random()*100,
        y: Math.random()*100
     }
    });

    update(enemyData)


    scoreboard.currentScore++;
  };




  updateScore();
  turn();
  setInterval(turn,2000);
  setInterval(updateScore,400);

}

play()
