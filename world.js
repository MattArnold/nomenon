(function () {
  var array_size = 10,
    map;

  // Passing multiple parameters creates a multi-dimensional array.
  function createArray(length) {
    var arr = new Array(length || 0),
      i = length;
    if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
  }

  //Returns the number of cells in a ring around (x,y) that are the designated color.
  function countNeighbors(map, color, x, y) {
    var count = 0;
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        var neighbor_x = x + i;
        if (neighbor_x < 0) {
          neighbor_x = map.length;
        } else if (neighbor_x > map.length) {
          neighbor_x = 0;
        }
        var neighbor_y = y + j;
        if (neighbor_y < 0) {
          neighbor_y = map.length;
        } else if (neighbor_y > map.length) {
          neighbor_y = 0;
        }
        //If we're looking at the middle point
        if (i == 0 && j == 0) {
          //Do nothing. The cell is not a neighbor to itself.
        }
        //In case the index we're looking at is off the edge of the map...
        else if (neighbor_x < 0 || neighbor_y < 0 || neighbor_x >= map.length || neighbor_y >= map[0].length) {
          // ... we still count it as a real location
          count++;
        }
        //Otherwise, a normal check of the neighbor
        else if (map[neighbor_x][neighbor_y] == color) {
          count++;
        }
      }
    }
    return count;
  }

  //Returns the number of cells which share an edge with (x,y) that are the designated color.
  function countOrthoNeighbors(map, color, x, y) {
    var count = 0;

    if (map[x + 1]) {
      if (map[x + 1][y] == color) { count++; }
    } else {
      if (map[0][y] == color) { count = count + 1 }
    }

    if (map[x - 1]) {
      if (map[x - 1][y] == color) { count++; }
    } else {
      if (map[map.length - 1][y] == color) { count = count + 1 }
    }

    if (map[y + 1]) {
      if (map[x][y + 1] == color) { count++; }
    } else {
      if (map[x][0] == color) { count = count + 1 }
    }

    if (map[y - 1]) {
      if (map[x][y - 1] == color) { count++; }
    } else {
      if (map[x][map.length - 1] == color) { count = count + 1 }
    }

    return count;
  }

  function doSimulationStep(oldMap) {
    var mapCopy = createArray(array_size, array_size)
    //Loop over each row and column of the map
    for (var x = 0; x < oldMap.length; x++) {
      for (var y = 0; y < oldMap[0].length; y++) {
        var water_count = countNeighbors(oldMap, 'water', x, y);
        var grass_count = countNeighbors(oldMap, 'grass', x, y);
        var dirt_count = countNeighbors(oldMap, 'dirt', x, y);
        var highest = Math.max(dirt_count, grass_count, water_count);
        var water_ortho_count = countOrthoNeighbors(oldMap, 'water', x, y);
        var grass_ortho_count = countOrthoNeighbors(oldMap, 'grass', x, y);
        var dirt_ortho_count = countOrthoNeighbors(oldMap, 'dirt', x, y);
        var ortho_highest = Math.max(dirt_ortho_count, grass_ortho_count, water_ortho_count);
        var chance = Math.floor(Math.random() * 2);

        if (highest == grass_count && highest == water_count) {
          if (ortho_highest == grass_ortho_count && ortho_highest == water_ortho_count) {
            mapCopy[x][y] = (chance) ? 'grass' : 'water';
          } else if (ortho_highest == water_ortho_count) {
            mapCopy[x][y] = 'water';
          } else if (ortho_highest == grass_ortho_count) {
            mapCopy[x][y] = 'grass';
          }
        } else if (highest == grass_count && highest == dirt_count) {
          if (ortho_highest == grass_ortho_count && ortho_highest == dirt_ortho_count) {
            mapCopy[x][y] = (chance) ? 'grass' : 'dirt';
          } else if (ortho_highest == grass_ortho_count) {
            mapCopy[x][y] = 'grass';
          } else if (ortho_highest == dirt_ortho_count) {
            mapCopy[x][y] = 'dirt';
          }
        } else if (highest == water_count && highest == dirt_count) {
          if (ortho_highest == water_ortho_count && ortho_highest == dirt_ortho_count) {
            mapCopy[x][y] = (chance) ? 'water' : 'dirt';
          } else if (ortho_highest == water_ortho_count) {
            mapCopy[x][y] = 'water';
          } else if (ortho_highest == dirt_ortho_count) {
            mapCopy[x][y] = 'dirt';
          }
        } else if (highest == dirt_count) {
          mapCopy[x][y] = 'dirt';
        } else if (highest == grass_count) {
          mapCopy[x][y] = 'grass';
        } else if (highest == water_count) {
          mapCopy[x][y] = 'water';
        } else {
          mapCopy[x][y] = 'dirt';
        }
        mapCopy[x][y] = (mapCopy[x][y]) ? mapCopy[x][y] : 'dirt';
      }
    }
    return mapCopy;
  }

  var transpose = function (oldMap) {
    var newMap = createArray(array_size, array_size);
    for (var x = 0; x < oldMap.length; x++) {
      for (var y = 0; y < oldMap.length; y++) {
        newMap[x][y] = oldMap[y][x];
        newMap[y][x] = oldMap[x][y];
      }
    }
    return newMap;
  }

  var drawScene = function (currentMap) {
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

    for (var x = currentMap.length - 1; x >= 0; x--) {
      var this_row = currentMap[x];

      // x is the row, y is the column
      for (var y = this_row.length - 1; y >= 0; y--) {
        // rowheight = (height > rowheight) ? height + .1 / 10 : height - .1 / 10;
        // colheight = (height > colheight) ? height + .1 / 10 : colheight - .1 / 10;
        // height = height + rowheight + colheight;
        // var grass = (height > 3.12);
        // height += (grass) ? .5 : 0;
        // height -= 2.8;

        // var water = (height < 0.23);

        var height, color, top_color, decoration_color, far_margin, near_margin;
        if (this_row[y] == 'grass') {
          height = .5;
          color = green;
          top_color = lightgreen;
          decoration_color = darkgreen;
          far_margin = .85;
          near_margin = .15;
        } else if (this_row[y] == 'water') {
          color = lightblue;
          top_color = blue;
          decoration_color = white;
          height = 0.01;
          far_margin = .85;
          near_margin = .15;
        } else if (this_row[y] == 'dirt') {
          height = (Math.random() / 20) * 2.7 + .2;
          color = ochre;
          top_color = yellow;
          decoration_color = brown;
          far_margin = .95;
          near_margin = .05;
        } else {
          map = doSimulationStep(map);
          return
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

  document.getElementsByClassName('redraw')[0].onclick = function () {
    document.getElementById('canvas').getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    map = initializeMap(map);
    drawScene(map);
  };

  document.getElementsByClassName('clump')[0].onclick = function () {
    document.getElementById('canvas').getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    map = doSimulationStep(map);
    drawScene(map);
  };

  document.getElementsByClassName('rotate')[0].onclick = function () {
    document.getElementById('canvas').getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    map = transpose(map);
    map = map.reverse();
    drawScene(map);
  };

  map = createArray(array_size, array_size);

  function initializeMap(newMap) {
    for (i = 0; i < newMap.length; i++) {
      for (j = 0; j < newMap[0].length; j++) {
        var chance = (Math.floor(Math.random() * 3));
        if (chance < 1) {
          newMap[i][j] = 'water';
        } else if (chance == 1) {
          newMap[i][j] = 'dirt';
        } else if (chance > 1) {
          newMap[i][j] = 'grass';
        }
      }
    }
    return newMap;
  }

  map = initializeMap(map);
  drawScene(map);

})();