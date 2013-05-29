$(function(){
  $('#start').click(function(){
    $(this).hide();
    
    var rootPos = $("div.arena").position();
    var options = {
      x : 25, 
      y : 25,
      snakeSize : 20,
      rootPos : rootPos,
      interval : 150
    };
    
    var snake = new Snake(options);   
    snake.start();
    
  });
});