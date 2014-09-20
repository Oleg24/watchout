// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var gameBoard = d3.select('.container').append('svg:svg')
                  .attr('width', gameOptions.width)
                  .attr('height', gameOptions.height);


var Player = function() {

this.path = "m254,168c-1,0 -5.089417,-0.086823 -8,3c-8.26091,8.761124 -15.671326,23.536575 -21,46c-10.283386,43.350342 -7,68 -7,102c0,12 0.545212,28.135284 7,49c0.934586,3.021027 3.805649,6.448395 8,8c11.600998,4.291473 25,4 42,4c13,0 40.406189,2.608429 55,-1c9.560944,-2.364014 18.812134,-7.382568 24,-11c5.252319,-3.662384 9.769501,-8.390991 12,-12c1.662506,-2.690002 2.525299,-6.084412 4,-13c1.518311,-7.120026 3,-16 3,-19c0,-17 0,-35 0,-49c0,-25 -0.419189,-35.149048 -3,-44c-3.276489,-11.236755 -6.418518,-18.226273 -9,-24c-3.290771,-7.360077 -6.020538,-14.506638 -10,-21c-4.081085,-6.65918 -7.190582,-10.77977 -13,-16c-5.36377,-4.819763 -11.954681,-7.190887 -20,-9c-9.949585,-2.23732 -25.012085,-3.581818 -39,-3c-12.031189,0.500427 -16.137482,2.216568 -24,4c-3.083939,0.699524 -5,1 -6,1c-1,0 -2,1 -3,1c-1,0 -1.707108,0.292892 -1,1c0.707108,0.707108 2.292892,0.292892 3,1c0.707108,0.707108 1,1 2,1l0,2l1,0l0,0";
 // <line id="svg_9" y2="325" x2="335" y1="294" x1="239" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="5" stroke="#00bf5f" fill="red"/>
 // <line id="svg_10" y2="234" x2="264" y1="214" x1="264" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="5" stroke="#00bf5f" fill="none"/>
 // <line id="svg_11" y2="238" x2="315" y1="217" x1="314" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="5" stroke="#00bf5f" fill="none"/>
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
  };

  //Increase Score Function

  turn();
  setInterval(turn,2000);
  //setInterval(increaseScore,50)


}


var update = function(enemyData){

  //DATA JOIN
  var enemies = gameBoard.selectAll('circle.enemy').data(enemyData,function(d){ return d.id });

  //UPDATE  - Data that stayed
  enemies.transition()
    .duration(1000)
    .attr("cx", function(d){ return axes.x(d.x) })
    .attr("cy", function(d){ return axes.y(d.y) })

  //ENTER  -- New Data
    enemies.enter().append("svg:circle")
      .attr('class', 'enemy')
      .attr('cx', function(d){ return axes.x(d.x)})
      .attr('cy', function(d){ return axes.y(d.y)})
      .attr('r', 0)
      .attr('fill', 'red')
    .transition()
      .duration(1000)
      .attr("r", 10)



  //ENTER + UPDATE  -- All Data

  //EXIT -- Nodes that no longer have Data
}

play()
