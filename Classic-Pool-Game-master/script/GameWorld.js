"use strict";

function GameWorld() {
  this.whiteBallStartingPosition = new Vector2(413, 413);

  this.redBalls = [
    new Ball(new Vector2(1056, 433), Color.red), //3
    new Ball(new Vector2(1090, 374), Color.red), //4
    new Ball(new Vector2(1126, 393), Color.red), //8
    new Ball(new Vector2(1126, 472), Color.red), //10;
    new Ball(new Vector2(1162, 335), Color.red), //11
    new Ball(new Vector2(1162, 374), Color.red), //12
    new Ball(new Vector2(1162, 452), Color.red), //14
  ];

  this.yellowBalls = [
    new Ball(new Vector2(1022, 413), Color.yellow), //1
    new Ball(new Vector2(1056, 393), Color.yellow), //2
    new Ball(new Vector2(1090, 452), Color.yellow), //6
    new Ball(new Vector2(1126, 354), Color.yellow), //7
    new Ball(new Vector2(1126, 433), Color.yellow), //9
    new Ball(new Vector2(1162, 413), Color.yellow), //13
    new Ball(new Vector2(1162, 491), Color.yellow), //15
  ];

  this.whiteBall = new Ball(new Vector2(413, 413), Color.white);
  this.blackBall = new Ball(new Vector2(1090, 413), Color.black);

  this.balls = [
    this.yellowBalls[0],
    this.yellowBalls[1],
    this.redBalls[0],
    this.redBalls[1],
    this.blackBall,
    this.yellowBalls[2],
    this.yellowBalls[3],
    this.redBalls[2],
    this.yellowBalls[4],
    this.redBalls[3],
    this.redBalls[4],
    this.redBalls[5],
    this.yellowBalls[5],
    this.redBalls[6],
    this.yellowBalls[6],
    this.whiteBall,
  ];

  this.stick = new Stick({ x: 413, y: 413 });

  this.gameOver = false;
}

/*
** REFATORAÇÃO 3: Replace Conditional with Lookup
**
** Essa refatoração troca vários if/else ou switch que escolhem um valor por uma tabela 
** (objeto/mapa) de correspondência direta. Em vez de testar condições uma a uma, você 
** acessa o resultado diretamente pela chave, simplificando e tornando o código mais fácil 
** de manter.
**
** Código original:

GameWorld.prototype.getBallsSetByColor = function(color){

    if(color === Color.red){
        return this.redBalls;
    }
    if(color === Color.yellow){
        return this.yellowBalls;
    }
    if(color === Color.white){
        return this.whiteBall;
    }
    if(color === Color.black){
        return this.blackBall;
    }
}

**
**
** Código refatorado:
*/

GameWorld.prototype.getBallsSetByColor = function (color) {
  const map = {
    [Color.red]: this.redBalls,
    [Color.yellow]: this.yellowBalls,
    [Color.white]: this.whiteBall,
    [Color.black]: this.blackBall,
  };

  return map[color];
};

/*=====================================================================================*/

GameWorld.prototype.handleInput = function (delta) {
  this.stick.handleInput(delta);
};

GameWorld.prototype.update = function (delta) {
  this.stick.update(delta);

  for (var i = 0; i < this.balls.length; i++) {
    for (var j = i + 1; j < this.balls.length; j++) {
      this.handleCollision(this.balls[i], this.balls[j], delta);
    }
  }

  for (var i = 0; i < this.balls.length; i++) {
    this.balls[i].update(delta);
  }

  if (!this.ballsMoving() && AI.finishedSession) {
    Game.policy.updateTurnOutcome();
    if (Game.policy.foul) {
      this.ballInHand();
    }
  }
};

GameWorld.prototype.ballInHand = function () {
  if (AI_ON && Game.policy.turn === AI_PLAYER_NUM) {
    return;
  }

  KEYBOARD_INPUT_ON = false;
  this.stick.visible = false;
  if (!Mouse.left.down) {
    this.whiteBall.position = Mouse.position;
  } else {
    let ballsOverlap = this.whiteBallOverlapsBalls();

    if (
      !Game.policy.isOutsideBorder(Mouse.position, this.whiteBall.origin) &&
      !Game.policy.isInsideHole(Mouse.position) &&
      !ballsOverlap
    ) {
      KEYBOARD_INPUT_ON = true;
      Keyboard.reset();
      Mouse.reset();
      this.whiteBall.position = Mouse.position;
      this.whiteBall.inHole = false;
      Game.policy.foul = false;
      this.stick.position = this.whiteBall.position;
      this.stick.visible = true;
    }
  }
};

GameWorld.prototype.whiteBallOverlapsBalls = function () {
  let ballsOverlap = false;
  for (var i = 0; i < this.balls.length; i++) {
    if (this.whiteBall !== this.balls[i]) {
      if (
        this.whiteBall.position.distanceFrom(this.balls[i].position) < BALL_SIZE
      ) {
        ballsOverlap = true;
      }
    }
  }

  return ballsOverlap;
};

GameWorld.prototype.ballsMoving = function () {
  var ballsMoving = false;

  for (var i = 0; i < this.balls.length; i++) {
    if (this.balls[i].moving) {
      ballsMoving = true;
    }
  }

  return ballsMoving;
};

GameWorld.prototype.handleCollision = function (ball1, ball2, delta) {
  if (ball1.inHole || ball2.inHole) return;

  if (!ball1.moving && !ball2.moving) return;

  var ball1NewPos = ball1.position.add(ball1.velocity.multiply(delta));
  var ball2NewPos = ball2.position.add(ball2.velocity.multiply(delta));

  var dist = ball1NewPos.distanceFrom(ball2NewPos);

  if (dist < BALL_SIZE) {
    Game.policy.checkColisionValidity(ball1, ball2);

    var power =
      Math.abs(ball1.velocity.x) +
      Math.abs(ball1.velocity.y) +
      (Math.abs(ball2.velocity.x) + Math.abs(ball2.velocity.y));
    power = power * 0.00482;

    if (Game.sound && SOUND_ON) {
      var ballsCollide = sounds.ballsCollide.cloneNode(true);
      ballsCollide.volume = power / 20 < 1 ? power / 20 : 1;
      ballsCollide.play();
    }

    var opposite = ball1.position.y - ball2.position.y;
    var adjacent = ball1.position.x - ball2.position.x;
    var rotation = Math.atan2(opposite, adjacent);

    ball1.moving = true;
    ball2.moving = true;

    var velocity2 = new Vector2(
      90 * Math.cos(rotation + Math.PI) * power,
      90 * Math.sin(rotation + Math.PI) * power,
    );
    ball2.velocity = ball2.velocity.addTo(velocity2);

    ball2.velocity.multiplyWith(0.97);

    var velocity1 = new Vector2(
      90 * Math.cos(rotation) * power,
      90 * Math.sin(rotation) * power,
    );
    ball1.velocity = ball1.velocity.addTo(velocity1);

    ball1.velocity.multiplyWith(0.97);
  }
};

/* Feature 4: Implementação da mira prévia da jogada
 **
 ** Foi elaborado novas funções para traçar linhas e círculos no jogo em Canvas2D.js,
 ** Essas funções são aplicadas nas funções de colisão entre as bolas
 **
 */

GameWorld.prototype.shouldDrawAimGuide = function () {
  return (
    this.stick.visible &&
    !Game.policy.turnPlayed &&
    !this.ballsMoving() &&
    !Game.policy.foul &&
    !(AI_ON && Game.policy.turn === AI_PLAYER_NUM)
  );
};

GameWorld.prototype.getAimCollision = function () {
  var whiteBall = this.whiteBall;
  var direction = new Vector2(
    Math.cos(this.stick.rotation),
    Math.sin(this.stick.rotation),
  );
  var closestCollision = undefined;

  for (var i = 0; i < this.balls.length; i++) {
    var ball = this.balls[i];

    if (ball === whiteBall || ball.inHole || !ball.visible) {
      continue;
    }

    var toBall = ball.position.subtract(whiteBall.position);
    var projection = toBall.x * direction.x + toBall.y * direction.y;

    if (projection <= 0) {
      continue;
    }

    var distanceToPathSquared =
      toBall.x * toBall.x + toBall.y * toBall.y - projection * projection;
    var collisionRadius = BALL_SIZE;

    if (distanceToPathSquared > collisionRadius * collisionRadius) {
      continue;
    }

    var distanceToCollision =
      projection -
      Math.sqrt(collisionRadius * collisionRadius - distanceToPathSquared);

    if (distanceToCollision < 0) {
      continue;
    }

    if (!closestCollision || distanceToCollision < closestCollision.distance) {
      closestCollision = {
        ball: ball,
        distance: distanceToCollision,
        contactPosition: whiteBall.position.add(
          direction.multiply(distanceToCollision),
        ),
      };
    }
  }

  return closestCollision;
};

GameWorld.prototype.getAimGuideBorderEnd = function (
  start,
  direction,
  distanceLimit,
) {
  var endDistance = distanceLimit;
  var ballOrigin = new Vector2(25, 25);
  var minX = Game.policy.leftBorderX + ballOrigin.x;
  var maxX = Game.policy.rightBorderX - ballOrigin.x;
  var minY = Game.policy.topBorderY + ballOrigin.y;
  var maxY = Game.policy.bottomBorderY - ballOrigin.y;

  if (direction.x > 0) {
    endDistance = Math.min(endDistance, (maxX - start.x) / direction.x);
  } else if (direction.x < 0) {
    endDistance = Math.min(endDistance, (minX - start.x) / direction.x);
  }

  if (direction.y > 0) {
    endDistance = Math.min(endDistance, (maxY - start.y) / direction.y);
  } else if (direction.y < 0) {
    endDistance = Math.min(endDistance, (minY - start.y) / direction.y);
  }

  return start.add(direction.multiply(Math.max(0, endDistance)));
};

GameWorld.prototype.drawAimGuide = function () {
  if (!this.shouldDrawAimGuide()) {
    return;
  }

  var collision = this.getAimCollision();
  var whiteBall = this.whiteBall;
  var direction = new Vector2(
    Math.cos(this.stick.rotation),
    Math.sin(this.stick.rotation),
  );

  if (!collision) {
    var freeEnd = this.getAimGuideBorderEnd(whiteBall.position, direction, 700);
    Canvas2D.drawLine(
      whiteBall.position,
      freeEnd,
      "#FFFFFF",
      3,
      0.42,
      [14, 12],
    );
    return;
  }

  var objectDirection = collision.ball.position.subtract(
    collision.contactPosition,
  );
  objectDirection.normalize();

  var targetEnd = this.getAimGuideBorderEnd(
    collision.ball.position,
    objectDirection,
    520,
  );

  Canvas2D.drawLine(
    whiteBall.position,
    collision.contactPosition,
    "#FFFFFF",
    3,
    0.65,
    [15, 10],
  );
  Canvas2D.drawCircle(
    collision.contactPosition,
    BALL_SIZE / 2,
    "#FFFFFF",
    2,
    0.45,
  );
  Canvas2D.drawLine(
    collision.ball.position,
    targetEnd,
    "#FFD451",
    4,
    0.74,
    [18, 10],
  );
  Canvas2D.drawCircle(
    collision.ball.position,
    BALL_SIZE / 2,
    "#FFD451",
    2,
    0.5,
  );
};

GameWorld.prototype.draw = function () {
  Canvas2D.drawImage(sprites.background);
  Game.policy.drawScores();

  for (var i = 0; i < this.balls.length; i++) {
    this.balls[i].draw();
  }

  this.drawAimGuide();
  this.stick.draw();
};

GameWorld.prototype.reset = function () {
  this.gameOver = false;

  for (var i = 0; i < this.balls.length; i++) {
    this.balls[i].reset();
  }

  this.stick.reset();

  if (AI_ON && AI_PLAYER_NUM === 0) {
    AI.startSession();
  }
};

GameWorld.prototype.initiateState = function (balls) {
  for (var i = 0; i < this.balls.length; i++) {
    this.balls[i].position.x = balls[i].position.x;
    this.balls[i].position.y = balls[i].position.y;
    this.balls[i].visible = balls[i].visible;
    this.balls[i].inHole = balls[i].inHole;
  }

  this.stick.position = this.whiteBall.position;
};
