addEventListener('load', () => {
  function Tile(initialValue = 0) {
    this.value = initialValue;
  }

  function toGridCoordinates(x, y) {
    return {
      x: Math.floor(x / tileSide),
      y: Math.floor(y / tileSide)
    };
  }

  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.strokeStyle = 'white';
    for (var i = 0; i < width; i++)
      for (var j = 0; j < height; j++) {
        switch (tiles[i][j].value) {
          case 0:
            ctx.fillStyle = '#222';
            break;
          case 1:
            ctx.fillStyle = 'blue';
            break;
          case 2:
            ctx.fillStyle = 'red';
            break;
        }
        ctx.fillRect(i * tileSide, j * tileSide, tileSide, tileSide);
        ctx.strokeRect(i * tileSide, j * tileSide, tileSide, tileSide);
      }
  }

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var width = prompt('Width:')
  var height = prompt('Height:')
  var tileSide = Math.min(innerWidth / width, innerHeight / height);
  var tiles = [];
  var turn = 1;
  var turns = 1;
  var skipNextTurn = false;
  canvas.width = width * tileSide;
  canvas.height = height * tileSide;
  for (var i = 0; i < width; i++) {
    tiles[i] = [];
    for (var j = 0; j < height; j++) {
      tiles[i].push(new Tile());
    }
  }
  canvas.addEventListener('click', e => {
    var gridCoordinates = toGridCoordinates(e.offsetX, e.offsetY);
    var clickedTile = tiles[gridCoordinates.x][gridCoordinates.y];
    var somethingChanged = true;
    if (clickedTile.value) turns--;
    console.log(turns);
    clickedTile.value = turn;
    while (somethingChanged) {
      somethingChanged = false;
      for (var rectangleWidth = 3; rectangleWidth <= width; rectangleWidth++) {
        for (var rectangleHeight = 3; rectangleHeight <= height; rectangleHeight++) {
          for (var i = 0; i <= width - rectangleWidth; i++) {
            for (var j = 0; j <= height - rectangleHeight; j++) {
              var borderColor = tiles[i][j].value;
              for (var k = i + 1; k < i + rectangleWidth - 1 && borderColor; k++) {
                if (borderColor !== tiles[k][j].value) borderColor = 0;
              }
              for (var k = j + 1; k < j + rectangleHeight - 1 && borderColor; k++) {
                if (borderColor !== tiles[i][k].value) borderColor = 0;
              }
              for (var k = i; k < i + rectangleWidth - 1 && borderColor; k++) {
                if (borderColor !== tiles[k][j + rectangleHeight - 1].value) borderColor = 0;
              }
              for (var k = j; k < j + rectangleHeight - 1 && borderColor; k++) {
                if (borderColor !== tiles[i + rectangleWidth - 1][k].value) borderColor = 0;
              }
              if (borderColor) {
                for (var k = i; k < i + rectangleWidth; k++) {
                  for (var l = j; l < j + rectangleHeight; l++) {
                    var tile = tiles[k][l];
                    if (tile.value !== borderColor) {
                      tile.value = borderColor;
                      somethingChanged = true;
                    }
                    draw();
                  }
                }
              }
            }
          }
        }
      }
    }
    turns--;
    if (turns <= 0) {
      turn = turn % 2 + 1;
      console.log(-turns);
      turns = (-turns) + 1;
    }
    console.log(turns)
    draw();
    var complete = true;
    var player1Tiles = 0;
    var player2Tiles = 0;
    for (var i = 0; i < width && complete; i++) {
      for (var j = 0; j < height && complete; j++) {
        var value = tiles[i][j].value;
        if (value === 0) complete = false;
        else if (value === 1) player1Tiles++;
        else if (value === 2) player2Tiles++;
      }
    }
    if (complete) {
      if (player2Tiles < player1Tiles) alert('Player 1 won.');
      else if (player1Tiles < player2Tiles) alert('Player 2 won.');
      else alert('Draw.');
    }
  });
  document.body.appendChild(canvas);
  draw();
});