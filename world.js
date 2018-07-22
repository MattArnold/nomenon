(function () {
  var panel = document.getElementById("control"),
    button = document.getElementById("redraw-btn"),
    xview = 13,
    yview = 13;
    var drawScene = function () {
      console.log('reached');

      var Point = Isomer.Point;
      var Path = Isomer.Path;
      var Shape = Isomer.Shape;
      var Vector = Isomer.Vector;
      var Color = Isomer.Color;

        var iso = new Isomer(document.getElementById("canvas"));

      var red = new Color(160, 60, 50);
      var blue = new Color(50, 60, 160);
      var lightblue = new Color(104, 169, 255);
      var white = new Color(240, 240, 240);
      var ochre = new Color(206, 166, 26);
      var yellow = new Color(243, 225, 113);
      var brown = new Color(193, 182, 139);
      var lightgreen = new Color(36, 165, 79);
      var green = new Color(30, 112, 58);
      var darkgreen = new Color(30, 91, 41);

      var rowheight, colheight = 0;
      var grass = true;

      for (var x = xview; x > 1; x = x - 1) {
        // x is the row, y is the column
        for (var y = yview; y > 1; y = y - 1) {
          var height = Math.random() / 40 * 1.6 + 1;
          rowheight = (height > rowheight) ? height + .1 / 10 : height - .1 / 10;
          colheight = (height > colheight) ? height + .1 / 10 : colheight - .1 / 10;
          height = height + rowheight + colheight;
          var grass = (height > 3.12);
          height += (grass) ? .5 : 0;
          height -= 2.8;
          var water = (height < 0.23);
          var color = ochre,
            top_color = yellow,
            decoration_color = brown,
            far_margin = .95;
          near_margin = .05;
          if (grass) {
            color = green;
            top_color = lightgreen,
              decoration_color = darkgreen;
          }
          if (water) {
            color = lightblue;
            top_color = blue;
            decoration_color = white;
            height = 0.01;
            far_margin = .85;
            near_margin = .15;
          }

          // Add the undecorated brick:
          iso.add(Shape.Prism(Point(x, y), 1, 1, height), color);

          // Add top layer to the brick:
          iso.add(new Path([
            Point(x + near_margin, y + near_margin, height),
            Point(x + far_margin, y + near_margin, height),
            Point(x + far_margin, y + far_margin, height),
            Point(x + near_margin, y + far_margin, height)
          ]), top_color);

          // Add decorations to the brick:
          var howmany = Math.floor(Math.random() * 6);
          for (i = 0; i < howmany; i++) {
            var xorigin = x + 0.1 + Math.random() * 0.5;
            var yorigin = y + 0.1 + Math.random() * 0.5;
            var size = Math.random();
            size = (xorigin + size > x + .9) ? (x + 0.7) - xorigin : size;
            size = (yorigin + size > y + .9) ? (y + 0.7) - yorigin : size;
            iso.add(new Path([
              Point(xorigin, yorigin, height),
              Point(xorigin + size, yorigin, height),
              Point(xorigin + size, yorigin + size, height),
              Point(xorigin, yorigin + size, height)
            ]), decoration_color);

          }

        }
      }
    } // end drawScene

  document.getElementById('redraw-btn').onclick = function () {
    document.getElementById('canvas').getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    drawScene();
  };

  drawScene();
})();