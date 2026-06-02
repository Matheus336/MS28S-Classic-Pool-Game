"use strict";

function Score(position) {
  this.position = position;
  this.origin = new Vector2(47, 82);
  this.value = 0;
}

Score.prototype.reset = function () {
  this.position = position;
  this.origin = new Vector2(30, 0);
  this.value = 0;
};

Score.prototype.draw = function () {
  Canvas2D.drawText(
    this.value,
    this.position,
    this.origin,
    // Alteração da cor do texto do placar para melhor visualização
    "#068740",
    "top",
    "Impact",
    "200px",
  );
};

/*
** Feature 3: Alteração do placar do jogo atual para melhor visualização, utilizando círculos para representar os 
** pontos dos jogadores.
**
** Anteriormente estava sendo exibido com a letra 'I' para cada ponto, o que dificultava a visualização, 
** principalmente para jogadores com baixa acuidade visual.
**
** Código original:

Score.prototype.drawLines = function (color) {
    
    for(let i=0; i<this.value; i++){

        let pos = this.position.add(new Vector2(i*15,0));

        Canvas2D.drawText(
            "I", 
            pos, 
            this.origin, 
            color, 
            "top", 
            "Arial", 
            "20px"
        );

    }
  };

**
** Código alterado para utilizar círculos:
*/

Score.prototype.drawLines = function (color) {
  for (let i = 0; i < this.value; i++) {
    let pos = this.position.add(new Vector2(i * 20, -10));

    Canvas2D.drawText("●", pos, this.origin, color, "top", "Arial", "40px");
  }
};

Score.prototype.increment = function () {
  this.value++;
};
