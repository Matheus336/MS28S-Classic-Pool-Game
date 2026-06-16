"use strict";

function Canvas2D_Singleton() {
  this._canvas = null;
  this._canvasContext = null;
  this._canvasOffset = Vector2.zero;
}

Object.defineProperty(Canvas2D_Singleton.prototype, "offset", {
  get: function () {
    return this._canvasOffset;
  },
});

Object.defineProperty(Canvas2D_Singleton.prototype, "scale", {
  get: function () {
    return new Vector2(
      this._canvas.width / Game.size.x,
      this._canvas.height / Game.size.y,
    );
  },
});

Canvas2D_Singleton.prototype.initialize = function (divName, canvasName) {
  this._canvas = document.getElementById(canvasName);
  this._div = document.getElementById(divName);

  if (this._canvas.getContext)
    this._canvasContext = this._canvas.getContext("2d");
  else {
    alert("Your browser is not HTML5 compatible.!");
    return;
  }
  window.onresize = Canvas2D_Singleton.prototype.resize;
  this.resize();
};

Canvas2D_Singleton.prototype.clear = function () {
  this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
};

Canvas2D_Singleton.prototype.resize = function () {
  var gameCanvas = Canvas2D._canvas;
  var gameArea = Canvas2D._div;
  var widthToHeight = Game.size.x / Game.size.y;
  var newWidth = window.innerWidth;
  var newHeight = window.innerHeight;
  var newWidthToHeight = newWidth / newHeight;

  if (newWidthToHeight > widthToHeight) {
    newWidth = newHeight * widthToHeight;
  } else {
    newHeight = newWidth / widthToHeight;
  }
  gameArea.style.width = newWidth + "px";
  gameArea.style.height = newHeight + "px";

  gameArea.style.marginTop = (window.innerHeight - newHeight) / 2 + "px";
  gameArea.style.marginLeft = (window.innerWidth - newWidth) / 2 + "px";
  gameArea.style.marginBottom = (window.innerHeight - newHeight) / 2 + "px";
  gameArea.style.marginRight = (window.innerWidth - newWidth) / 2 + "px";

  gameCanvas.width = newWidth;
  gameCanvas.height = newHeight;

  var offset = Vector2.zero;
  if (gameCanvas.offsetParent) {
    do {
      offset.x += gameCanvas.offsetLeft;
      offset.y += gameCanvas.offsetTop;
    } while ((gameCanvas = gameCanvas.offsetParent));
  }
  Canvas2D._canvasOffset = offset;
};

Canvas2D_Singleton.prototype.drawImage = function (
  sprite,
  position,
  rotation,
  scale,
  origin,
) {
  var canvasScale = this.scale;

  position = typeof position !== "undefined" ? position : Vector2.zero;
  rotation = typeof rotation !== "undefined" ? rotation : 0;
  scale = typeof scale !== "undefined" ? scale : 1;
  origin = typeof origin !== "undefined" ? origin : Vector2.zero;

  this._canvasContext.save();
  this._canvasContext.scale(canvasScale.x, canvasScale.y);
  this._canvasContext.translate(position.x, position.y);
  this._canvasContext.rotate(rotation);
  this._canvasContext.drawImage(
    sprite,
    0,
    0,
    sprite.width,
    sprite.height,
    -origin.x * scale,
    -origin.y * scale,
    sprite.width * scale,
    sprite.height * scale,
  );
  this._canvasContext.restore();
};

Canvas2D_Singleton.prototype.drawText = function (
  text,
  position,
  origin,
  color,
  textAlign,
  fontname,
  fontsize,
) {
  var canvasScale = this.scale;

  position = typeof position !== "undefined" ? position : Vector2.zero;
  origin = typeof origin !== "undefined" ? origin : Vector2.zero;
  color = typeof color !== "undefined" ? color : Color.black;
  textAlign = typeof textAlign !== "undefined" ? textAlign : "top";
  fontname = typeof fontname !== "undefined" ? fontname : "sans-serif";
  fontsize = typeof fontsize !== "undefined" ? fontsize : "20px";

  this._canvasContext.save();
  this._canvasContext.scale(canvasScale.x, canvasScale.y);
  this._canvasContext.translate(position.x - origin.x, position.y - origin.y);
  this._canvasContext.textBaseline = "top";
  this._canvasContext.font = fontsize + " " + fontname;
  this._canvasContext.fillStyle = color.toString();
  this._canvasContext.textAlign = textAlign;
  this._canvasContext.fillText(text, 0, 0);
  this._canvasContext.restore();
};

/* Feature 4: Implementação da mira prévia da jogada
 **
 ** Foi elaborado novas funções para traçar linhas e círculos no jogo, a fim de que o jogador
 ** possa estimar o destino da bola branca e da sua própria bola
 **
 */

Canvas2D_Singleton.prototype.drawLine = function (
  start,
  end,
  color,
  lineWidth,
  alpha,
  dash,
) {
  var canvasScale = this.scale;

  color = typeof color !== "undefined" ? color : Color.white;
  lineWidth = typeof lineWidth !== "undefined" ? lineWidth : 2;
  alpha = typeof alpha !== "undefined" ? alpha : 1;
  dash = typeof dash !== "undefined" ? dash : [];

  this._canvasContext.save();
  this._canvasContext.scale(canvasScale.x, canvasScale.y);
  this._canvasContext.globalAlpha = alpha;
  this._canvasContext.strokeStyle = color.toString();
  this._canvasContext.lineWidth = lineWidth;
  this._canvasContext.lineCap = "round";
  this._canvasContext.setLineDash(dash);
  this._canvasContext.beginPath();
  this._canvasContext.moveTo(start.x, start.y);
  this._canvasContext.lineTo(end.x, end.y);
  this._canvasContext.stroke();
  this._canvasContext.restore();
};

Canvas2D_Singleton.prototype.drawCircle = function (
  position,
  radius,
  color,
  lineWidth,
  alpha,
  fillColor,
) {
  var canvasScale = this.scale;

  color = typeof color !== "undefined" ? color : Color.white;
  lineWidth = typeof lineWidth !== "undefined" ? lineWidth : 2;
  alpha = typeof alpha !== "undefined" ? alpha : 1;

  this._canvasContext.save();
  this._canvasContext.scale(canvasScale.x, canvasScale.y);
  this._canvasContext.globalAlpha = alpha;
  this._canvasContext.strokeStyle = color.toString();
  this._canvasContext.lineWidth = lineWidth;
  this._canvasContext.beginPath();
  this._canvasContext.arc(position.x, position.y, radius, 0, Math.PI * 2);
  if (fillColor) {
    this._canvasContext.fillStyle = fillColor.toString();
    this._canvasContext.fill();
  }
  this._canvasContext.stroke();
  this._canvasContext.restore();
};

var Canvas2D = new Canvas2D_Singleton();
