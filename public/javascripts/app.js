$(function(){
  $('#start').click(function(){
    $(this).hide();
            
    new Snake({
      x : 30, 
      y : 30,
      snakeSize : 20,
      interval : 150
    }).start();
    
  });
});