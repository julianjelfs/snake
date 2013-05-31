$(function(){
  
  var socket = io.connect('http://express-box-6905.euw1.actionbox.io');
  
  $('#ping').click(function(){
    socket.emit('ping', { msg : 'hello from snake' });  
  });
  
  socket.on('ping', function(data){
    console.log(data.msg);  
  });
  
  $('#start').click(function(){
    $(this).hide();
            
    new Snake({
      x : 25, 
      y : 25,
      snakeSize : 20,
      interval : 150,
      speedUp : true
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