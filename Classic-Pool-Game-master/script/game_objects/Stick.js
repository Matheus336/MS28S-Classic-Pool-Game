"use strict";

function Stick(position) {
  this.position = position;
  this.origin = new Vector2(970, 11);
  this.shotOrigin = new Vector2(950, 11);
  this.shooting = false;
  this.visible = true;
  this.rotation = 0;
  this.power = 0;
  this.trackMouse = true;
  // Variáveis novas para controle de carregamento da força
  this.charging = false;
  this.powerDirection = 1;
}

/*
 **
 ** Feature 1: Alteração da mecânica de carregamento da força
 ** Ao teclar W é pressionada, a força começa a aumentar gradualmente, oscilando entre 0 e 100.
 ** O jogador pode soltar a tecla W a qualquer momento para disparar a bola com a força atual.
 **
 ** Função handleInput() refeita:
 */

Stick.prototype.handleInput = function (delta) {
  if (AI_ON && Game.policy.turn === AI_PLAYER_NUM) return;

  if (Game.policy.turnPlayed) return;

  if (Keyboard.down(Keys.W) && KEYBOARD_INPUT_ON) {
    this.charging = true;

    // Velocidade da oscilação da força do taco
    this.power += this.powerDirection * 0.4;

    if (this.power >= 100) {
      this.power = 100;
      this.powerDirection = -1;
    }

    if (this.power <= 0) {
      this.power = 0;
      this.powerDirection = 1;
    }

    this.origin.x = 990 - this.power * -0.47;
  } else if (this.charging) {
    this.charging = false;

    if (this.power > 0) {
      this.shoot(this.power, this.rotation);
    }
  }

  if (this.trackMouse) {
    var opposite = Mouse.position.y - this.position.y;
    var adjacent = Mouse.position.x - this.position.x;
    this.rotation = Math.atan2(opposite, adjacent);
  }
};

/*
** Função handeInput() antiga:

Stick.prototype.handleInput = function (delta) {

    if(AI_ON && Game.policy.turn === AI_PLAYER_NUM)
      return;

    if(Game.policy.turnPlayed)
      return;

    if(Keyboard.down(Keys.W) && KEYBOARD_INPUT_ON){
      if(this.power < 75){
        this.origin.x+=2;
        this.power+=1.2;
      }
    }

    if(Keyboard.down(Keys.S) && KEYBOARD_INPUT_ON){
      if(this.power>0){
        this.origin.x-=2;
        this.power-=1.2;
      }
    }

    else if (this.power>0 && Mouse.left.down){
      var strike = sounds.strike.cloneNode(true);
      strike.volume = (this.power/(10))<1?(this.power/(10)):1;
      strike.play();
      Game.policy.turnPlayed = true;
      this.shooting = true;
      this.origin = this.shotOrigin.copy();

      Game.gameWorld.whiteBall.shoot(this.power, this.rotation);
      var stick = this;
      setTimeout(function(){stick.visible = false;}, 500);
    }
    else if(this.trackMouse){
      var opposite = Mouse.position.y - this.position.y;
      var adjacent = Mouse.position.x - this.position.x;
      this.rotation = Math.atan2(opposite, adjacent);
    }
};
*/
Stick.prototype.shoot = function (power, rotation) {
  this.power = power;
  this.rotation = rotation;

  if (Game.sound && SOUND_ON) {
    var strike = sounds.strike.cloneNode(true);
    strike.volume = this.power / 10 < 1 ? this.power / 10 : 1;
    strike.play();
  }
  Game.policy.turnPlayed = true;
  this.shooting = true;
  this.origin = this.shotOrigin.copy();

  Game.gameWorld.whiteBall.shoot(this.power, this.rotation);
  var stick = this;
  setTimeout(function () {
    stick.visible = false;
  }, 500);
};

Stick.prototype.update = function () {
  if (this.shooting && !Game.gameWorld.whiteBall.moving) this.reset();
};

Stick.prototype.reset = function () {
  this.position.x = Game.gameWorld.whiteBall.position.x;
  this.position.y = Game.gameWorld.whiteBall.position.y;
  this.origin = new Vector2(970, 11);
  this.shooting = false;
  this.visible = true;
  this.power = 0;
  // Variáveis novas para controle de carregamento da força
  this.powerDirection = 1;
  this.charging = false;
};

Stick.prototype.draw = function () {
  if (!this.visible) return;
  Canvas2D.drawImage(
    sprites.stick,
    this.position,
    this.rotation,
    1,
    this.origin,
  );
};
