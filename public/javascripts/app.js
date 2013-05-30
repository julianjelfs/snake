$(function(){
  $('#start').click(function(){
    $(this).hide();
            
    new Snake({
      x : 25, 
      y : 25,
      snakeSize : 20,
      interval : 150,
      speedUp : false
    }).start();
    
    /*
    new Snake({
      x : 25, 
      y : 25,
      snakeSize : 20,
      interval : 150,
      speedUp : false
    }).start();
    */
    
  });
});