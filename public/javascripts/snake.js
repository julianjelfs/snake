(function (scope) {

    function getRandomCoords(options) {
        var rx = getRandomNum(options.x);
        var ry = getRandomNum(options.y);
        return {
            left: (rx * options.snakeSize),
            top: (ry * options.snakeSize)
        }
    }

    function getRandomNum(max) {
        return Math.floor(Math.random() * max);
    }

    scope.Segment = function (options, c) {
        var coords = c || getRandomCoords(options);

        var segment = $("<div class='" + (options.ghost ? "ghost-segment" : "segment") + "'></div>").css({
            top: coords.top,
            left: coords.left,
            width: options.snakeSize,
            height: options.snakeSize
        }).appendTo("div.arena").show();

        var next;

        return {
            coords : coords,
            position: function () {
                return segment.position();
            },
            moveTo: function (pos) {
                if (next != null) {
                    next.moveTo(this.position());
                }
                segment.css({
                    top: pos.top,
                    left: pos.left
                });
            },
            addSegment: function () {
                if (next == null) {
                    next = new scope.Segment(options);
                } else {
                    next.addSegment();
                }
            },
            segmentsAtPos: function (headPos) {
                var pos = this.position();
                var num = (headPos.top == pos.top && headPos.left == pos.left) ? 1 : 0;
                return next == null ? num : num + next.segmentsAtPos(headPos);
            }
        }
    }


    scope.Snake = function (options) {

        var food = $("div.food");
        if (food.size() == 0) {
            food = $("<div class='food'></div>").appendTo("div.arena").hide();
        }
        var scoreSpan = $("#score");
        var start = $("#start");
        var keypresses = [], tail, head, loopHandle, up = 1,
            down = 2,
            left = 3,
            right = 4,
            direction = 4,
            foodPos;

        if(!options.ghost){
            $("body").keydown(function (e) {
                keypresses.push(e.which);
            });
        }

        if(options.ghost){

            options.socket.on('foodPlanted', function(data){
                $("div.ghost-food").remove();
                $("<div class='ghost-food'></div>").appendTo("div.arena").css({
                    top: data.coords.top,
                    left: data.coords.left,
                    width: options.snakeSize,
                    height: options.snakeSize
                });
                foodPos = data.coords;
            });

            options.socket.on("moveHead", function(data){
                moveHead(data.pos);
            });

            options.socket.on("gameOver", function(msg){
                gameover(msg)
            });

            options.socket.on('createHead', function(data){
                console.log("Let's create a ghost head");
                tail = head = new scope.Segment(options, data.coords);
                //loopHandle = setInterval(eventLoop, options.interval);
            });

        }

        function incrementScore() {
            var score = parseInt(scoreSpan.text());
            score += 10;
            scoreSpan.text(score);
        }

        function plantFood() {
            var coords = getRandomCoords(options);
            food.css({
                top: coords.top,
                left: coords.left,
                width: options.snakeSize,
                height: options.snakeSize
            }).show();
            options.socket.emit("foodPlanted", {coords:coords});
            return coords;
        }

        function outOfBounds(pos) {
            if (pos.left > (options.x * options.snakeSize) - options.snakeSize
                || pos.left < 0
                || pos.top > (options.y * options.snakeSize) - options.snakeSize
                || pos.top < 0) {
                console.log(JSON.stringify(pos));
                return true;
            }
            return false;
        }

        function gameover(msg) {
            clearInterval(loopHandle);
            start.show();
            alert(msg + ". Game Over");
            scoreSpan.text("0");
            $("div.segment, div.ghost-segment").remove();
            options.socket.emit("gameOver", msg);
        }

        function crossedOver(pos) {
            return head.segmentsAtPos(pos) > 0;
        }

        function speedUp() {
            clearInterval(loopHandle);
            options.interval -= 5;
            loopHandle = setInterval(eventLoop, options.interval);
        }

        function moveHead(newPos) {
            var hitFood = newPos.top == foodPos.top && newPos.left == foodPos.left;

            if (hitFood) {
                head.addSegment();
            }
            head.moveTo(newPos);
            return hitFood;
        }

        function eventLoop() {
            if (keypresses.length > 0) {
                var key = keypresses[0]
                keypresses.splice(0, 1);
                if (key == 37 && direction != right) {
                    direction = left;
                } else if (key == 38 && direction != down) {
                    direction = up;
                } else if (key == 39 && direction != left) {
                    direction = right;
                } else if (key == 40 && direction != up) {
                    direction = down;
                }
            }


            var pos = head.position();
            var newPos = {
                left: direction == up || direction == down ? pos.left : (direction == left ? pos.left - options.snakeSize : pos.left + options.snakeSize),
                top: direction == left || direction == right ? pos.top : (direction == up ? pos.top - options.snakeSize : pos.top + options.snakeSize)
            }

            if (outOfBounds(newPos)) {
                return gameover("Out of bounds");
            }

            if (crossedOver(newPos)) {
                return gameover("Tangled up");
            }

            var hitFood = moveHead(newPos);

            options.socket.emit("moveHead", {pos : newPos});

            if (hitFood) {
                incrementScore();
                foodPos = plantFood();
                if (options.speedUp)
                    speedUp();
            }
        }

        return {
            start: function () {
                $("div.arena").css({
                    width: options.x * options.snakeSize,
                    height: options.y * options.snakeSize
                });

                if(!options.ghost){
                    foodPos = plantFood();
                    tail = head = new scope.Segment(options);
                    loopHandle = setInterval(eventLoop, options.interval);
                    console.log("sending createHead message");
                    options.socket.emit("createHead", {coords:head.coords});
                }
            }
        }
    }

})(window);