(function(scope){

  function getRandomCoords(options){
    var rx = getRandomNum(options.x);
    var ry = getRandomNum(options.y);
    return {
      left : (rx * options.snakeSize),
      top : (ry * options.snakeSize)
    }
  }
  
function getRandomNum(max) {
  return Math.floor(Math.random() * max);
}

scope.Segment = function (options){
  var coords = getRandomCoords(options);
  var segment = $("<div class='segment'></div>").css({
    top : coords.top,
    left : coords.left,
    width : options.snakeSize,
    height : options.snakeSize
  }).appendTo("div.arena").show();
  
  var next;
  
  return {
    position : function(){
      return segment.position();
    },
    moveTo : function(pos){
      if(next != null){
         next.moveTo(this.position()); 
      }
      segment.css({
        top : pos.top,
        left : pos.left
      });
    },
    addSegment : function(){
      if(next == null){
         next = new scope.Segment(options); 
      } else {
        next.addSegment();  
      }
    }
  }
}


scope.Snake = function (options){
   
  var tail, head, loopHandle, up = 1,
        down = 2,
        left = 3,
        right = 4,
        direction = 4,
        arena = new Arena(options),
        foodPos;
  
  $("body").keydown(function(e) {
    if (e.which == 37 && direction != right) {
      direction = left;
    } else if (e.which == 38 && direction != down) {
      direction = up;
    } else if (e.which == 39 && direction != left) {
      direction = right;
    } else if (e.which == 40 && direction != up) {
      direction = down;
    }
  });
  
  function outOfBounds(pos){        
    if(pos.left > (options.x * options.snakeSize) + options.snakeSize
       || pos.left < 0 
       || pos.top > (options.y * options.snakeSize) + options.snakeSize
       || pos.top < 0 ) {
      return true;  
    }
    return false;
  }
  
  function gameover(){
    clearInterval(loopHandle);
    alert("Game Over");    
  }
  
  function crossedOver(pos){
    return false;
  }
  
  function eventLoop(){
    var pos = head.position();
    var newPos = {
      left : direction == up || direction == down ? pos.left : (direction == left ? pos.left - options.snakeSize : pos.left + options.snakeSize),
      top : direction == left || direction == right ? pos.top : (direction == up ? pos.top - options.snakeSize : pos.top + options.snakeSize)
    }   
       
    if(outOfBounds(pos)){
      return gameover();      
    }
    
    if(crossedOver()){
      return gameover();  
    }
    
    var hitFood = newPos.top == foodPos.top && newPos.left == foodPos.left;
    
    if(hitFood) {
      head.addSegment();
    }
    head.moveTo(newPos);
    
    if(hitFood){
       foodPos = arena.plantFood();       
    }
   
  }
  
  return {
    start : function(){
      tail = head = new scope.Segment(options);  
      foodPos = arena.plantFood();
      loopHandle = setInterval(eventLoop, options.interval);      
    }
  }
}

scope.Arena = function(options){
  
  var food = $("<div class='food'></div>").appendTo("div.arena").hide();
  
  return {
    plantFood : function(){
      var coords = getRandomCoords(options);      
      food.css({
        top : coords.top,
        left : coords.left,
        width : options.snakeSize,
        height : options.snakeSize
      }).show(); 
      return coords;
    }
  }
}
  
})(window);