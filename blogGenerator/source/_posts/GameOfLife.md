---
title: John Conway's Game of Life in Processing
date: 2017-10-17 17:27:30
tags: Processing Java Processing.js John Conway's Game Of Life
---


{% raw %}
<br><br>
<div style="position:relative; top:0; left:0">
    <a id="forkMe" href="https://github.com/stefano-lupo/Game-Of-Life">
    <img style="position: absolute; left:0" src="https://s3.amazonaws.com/github/ribbons/forkme_left_white_ffffff.png">
    </a>
    <img src="https://s3-eu-west-1.amazonaws.com/stefano-lupo-blog-photos/game-of-life/GameOfLife.gif">
</div>
{% endraw %}

{% raw %}
<script
  src="https://code.jquery.com/jquery-3.2.1.min.js"
  integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
  crossorigin="anonymous"></script>
<script>
    $(document).ready(function () {
        var forkMe = $('#forkMe')
        var crap = $('#forkMe > .fancybox');
        var good = crap.find('img');
        console.log(good);
        forkMe.append(good);
        crap.remove();
    })
   
</script>
{% endraw %}

### Checkout the live demo on my [Home Page!](http://www.stefanolupo.tech#game-of-life)

I was sitting in a lecture the other day when the lecturers screen saver appeared on the projector. It immediately drew all of our attention as it was a live simulation of [John Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). I had read and watched videos about this topic before and it is quite an interesting simulation. It acts as a model for population evolves over time and given the right inputs (or not!) it can produce some fascinating results for such a simple concept. I first heard about it from the same place I hear most of the interesting facts about the world, from Mr Michael Stevens aka [Vsauce](https://www.youtube.com/user/Vsauce). If you haven't heard of Vsauce you should definitely check out his YouTube channel. He makes extremely interesting videos on a huge variety of topics ranging from science and math to philosophy and psychology and his content is pretty widely accepted as some of the best on YouTube in that space. 

Here is a quick snippet from the video where he mentions it (~90 seconds and it *should* start from the right point!)
<div style=
    "float: none;
    clear: both;
    width: 100%;
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 25px;
    height: 0;">  
    <iframe style="position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;" 
        src="https://www.youtube.com/embed/aNgE_hf41NY?start=123" frameborder="0" allowfullscreen>
    </iframe>
</div>

So just to reiterate what Michael said (or for those who didn't feel like watching), the simulation contains a grid of cells which are either alive (lit up) or dead (dark) at any point in time. The interesting part comes from the rules which are applied to this grid of cells which govern how the cells survive, are killed and are reborn. The most common ruleset is the following:
>1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
>2. Any live cell with more than three live neighbours dies, as if by overpopulation.
>3. Any live cell with two or three live neighbours lives on to the next generation.
>4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

With those four simple rules, some really interesting patterns and phenomena occur such as oscilators and spaceships which can traverse the grid! This article is just to show a simple implementation of The Game of Life in Processing that I wrote on a ~~hungover~~ lazy Sunday afternoon and won't be exploring any of the outcomes in any great detail, but you can find a bunch more info from people who know a whole lot more about it than I do [right here!](http://web.stanford.edu/~cdebs/GameOfLife/)


# The Processing Code
The first thing I did was decide on the data structure I would use to represent the grid. The name pretty much gives the game away as a grid is basically a synonym for a matrix or 2D array. Next I declared some constans and global variables which would be useful later on. The only one of note here for now is `SQUARE_SIZE` which will be the number of pixels each cell will be, the rest are self-explanatory or will be explained later (you decide!).

```Processing
final int SQUARE_SIZE = 10;
final float GRID_SEED_THRESHOLD = 0.8;
final boolean DRAW_UI_INFO = false;

int numRows, numCols;
Cell[][] grid;
boolean settingUp = true;
int generation = 0;
int numberAlive = 0;
```

Next the good old `void setup()`. Here we define the size of our canvas, do some initialization and figure out the number of rows and columns of cells we can have. I was lazy and purposely set my `SQUARE_SIZE = 10` as I knew the size of my canvas would be a multiple of 10 meaning I wouldn't have any remainder pixels.

```Processing
void setup() {
    size(900, 600);
    numRows = width/SQUARE_SIZE;
    numCols = height/SQUARE_SIZE;
    grid = initGrid();
    generateRandomGrid();
}
```

The `initGrid()` function just creates instances of a `Cell` class (which will be created later) and slots them into a 2D array to act as our `grid`. 

```Processing
Cell[][] initGrid() {
    Cell[][] grid = new Cell[numRows][numCols];
    for (int i=0; i<numRows; i++ ) {
        for (int j=0; j<numCols; j++) {
            grid[i][j] = new Cell();
        }
    }

    return grid;
}
```

The other function here is `generateRandomGrid()`. This just iterates over our global `grid` and randomly populates some cells with living cells. This is handy for just creating a random grid to run in order to observe the simulation.

```Processing
void generateRandomGrid() {
    for (int i=0; i<numRows; i++) {
        for (int j=0; j<numCols; j++) {
            float r = random(1);
            if (r > GRID_SEED_THRESHOLD) {
                grid[i][j].alive = true;
            } else {
                grid[i][j].alive = false;
            }
        }
    }
}
```

Next up is the other good old - `void draw()`. This is split in two by an if statement which tests the `settingUp` boolean we defined earlier. In setup mode, you can bring cells to life by left clicking and kill off cells by right clicking by making calls on the `Cell` objects themselves (these will be shown later). This requires a method to convert the mouse click coordinates into row and column indices into the `grid` and this is done using the `getIndex(mouseX, mouseY)` function. Finally in setup mode, we check for some key strokes `'s'` and `'g'` and respond to them by starting the simulation and regenerating a new random board respectively. 

The other half (in running mode), simply applys Conway's rules to the current board by calling `applyRules()` and checks if the `'r'` key has been preset, which initiates a reset of the board through `reset()`.

Finally for both `settingUp` and `!settingUp` (simulating), we make a call to `drawGrid()` which simply draws grid full of living cells.

```Processing
void draw() {
    if (settingUp) {
        frameRate(30);
        int[] coords = getIndex(mouseX, mouseY);
        int i = coords[0];
        int j = coords[1];
        if (mousePressed) {
            if (mouseButton == LEFT) {
                grid[i][j].create();
            } else {
                grid[i][j].kill();
            }
        }
        if (keyPressed) {
            if (key == 's') {
                settingUp = false;
            } else if (key =='g') {
                generateRandomGrid();
            }
        }
    } else {
        frameRate(15);
        applyRules();
        if (keyPressed && key == 'r') {
            reset();
        }
    }

    drawGrid();
}
```

You may have have noticed the calls to `frameRate(30)` and `frameRate(15)`. These (obviously) adjust the frame rate and are are used to slow the simulation down a bit so that we can better see whats going on with how the cells are interacting.

The bodies of the methods mentioned above are given below.


### getIndex(mouseX, mouseY)
This returns valid indices into the `grid`. This actually caused some problems as clicking and dragging the mouse off the canvas actually caused processing to pass me coordinates that were out of range of the canvas (ie coordinates < 0 or coordinates > canvas height etc). A simple bit of logic can be used to combat this however. Taking `x` as an example coordinate we can:
1. `int largerThanZero = max(x, 0)` - This ensures that `x` is non-negative
2. `min(largerThanZero, width-1)` - This ensures that `x` is not larger than the size of the canvas.

Now that we have *cleaned* x and y coordinates, we can use integer division to get the nearest cell in our grid and return those as the indices.

```Processing
int[] getIndex(int x, int y) {
    int[] cleanedCoords = {min(max(x, 0), width-1), min(max(y, 0), height-1) - 1};
    cleanedCoords[0] = cleanedCoords[0] / SQUARE_SIZE;
    cleanedCoords[1] = cleanedCoords[1] / SQUARE_SIZE;
    return cleanedCoords;
}
```

### applyRules()
This is where the *interesting* logic of the simulation comes in. The rules were given above but here is a quick refresher in some weird pseudo-peseudoish-code: 
>1. (<2 neighbours) =  DIE
>2. (>3 neighbours) = DIE.
>3. (2 <= neighbours <= 3) && currentlyAlive = LIVE
>4. (neighbours == 3) && currentlyDead = REBIRTH

A key concept here is that rules apply to all of the cells in the grid for a given generation **simultaenously**. That is, you can't update the board as you iterate over it checking the cells of the current generation. We need a snapshot of the board in its current state to compare each cell against. Or more simply, we create a new board on each generation, fill **that** board based on the previous generation rather than updating the old board.

This function then is rather simple. We create our new grid using `initGrid()` and iterate over the board. For each cell, we check how many neighbours it has using the (yet to be defined) `getNumberOfNeigbours(rowIndex, columnIndex)` function, apply Conway's rules to that cell and figure out if it should be alive or dead in the next grid and update our **new** grid accordingly! Again we use some `Cell` instance methods `kill(), create()`(bring back to life) and `age()` that cell. Ageing has no effect on the simulation but is just used to set the colour of the cell in order to get a visual representation of how long a given cell has been around for.

```Processing
void applyRules() {
    // Create our NEW grid for the next generation
    Cell[][] nextGrid = initGrid();

    // This is just used to show the user how many cells are currently living
    numberAlive = 0;

    for (int i=0; i<numRows; i++) {
        for (int j=0; j<numCols; j++) {
            int numNeighbours = getNumberOfNeighbours(i, j);
            if (numNeighbours < 2 || numNeighbours > 3) {
                nextGrid[i][j].kill();
            } else {
                // Two or three neighbours
                if (!grid[i][j].alive && numNeighbours == 3) {
                    nextGrid[i][j].create();
                    numberAlive ++;
                } else {
                    // Alive with two or 3 neighbours
                    Cell oldCell = grid[i][j];
                    oldCell.age();
                    nextGrid[i][j] = oldCell;
                }
            }
        }
    }
    grid = nextGrid;
}
```

And of course the `getNumberOfNeighbours(row, column)` function will return the number of neighbours the cell at that position has. For the general case each cell has 8 possible neighbours - 3 above it, 2 on either side of it and 3 below it. However (literal) edge cases exist for cells that are on the border.

To handle these we can define the max and min allowed values for the row an column, and iterate from `rowMin` to `rowMax` and inside that iterate from `colMin` to `colMax`. In the general case where `r` and `c` are the cell in questions row and column:
- `rowMin` = `r-1`
- `rowMax` = `r+1`
- `colMin` = `c-1`
- `colMax` = `c+1`

However we apply the same trick of **maximizing** any potentially **negative** rows/cols with **0** and **minimizing** any rows/cols that can be **greater than the `grid` dimensions** with the `numRows` and `numCols` respectively. 

Finally we can iterate over the 9 adjacent cells, and perform one last check that we aren't at the `row` and `column` that corresponds to ourselves (as we don't want to count ourselves!).
```Processing
int getNumberOfNeighbours(int r, int c) {
    int numberOfNeighbours = 0;

    int rowMin = max(r-1, 0);
    int rowMax = min(r+1, numRows-1);

    int colMin = max(c-1, 0);
    int colMax = min(c+1, numCols-1);

    for (int row = rowMin; row <= rowMax; row++) {
        for (int col = colMin; col <= colMax; col++) {
            if (row != r || col != c) {
                if (grid[row][col].alive) {
                    numberOfNeighbours ++;
                }
            }
        }
    }

    return numberOfNeighbours;
}
```

### drawGrid()
Finally after all that work it's time to draw something to the screen. This part is easy, just iterate over the grid and call `cell.drawCell(row, column)` on each cell in the grid and they will handle drawing themsevles. The only other things in this method are clearing the prevously drawn cells by redrawing a black backgroun with `background(0)` and (conditionally) drawing an overlay containing some info about the simulation (how many are currently alive / generation number etc). 

```Processing
void drawGrid() {
    background(0);
    for (int i=0; i<numRows; i++) {
        for (int j=0; j<numCols; j++) {
            grid[i][j].drawCell(i,j);   
        }
    }
    
    if(DRAW_UI_INFO) {
        drawUI();
    }
}
```

### reset()
The last function we need is one to reset the board and it is pretty self explanatory - it puts us back in setup mode, recreates a fresh grid and reinitializes the generation and number of alive cells to 0. In Java, we can rest assured that garbage collection will handle freeing up our now out of scope old grid. 

```Processing
void reset() {
    settingUp = true;
    grid = initGrid();
    generation = 0;
    numberAlive = 0;
}
```


## The Cell Class
Almost there, just a super basic class to represent our `Cell`s. The only interesting thing about this Cell class is the concept of "colour-aging". As discussed, I thought it would be nice to have some visual feedback on how long a certain cell had been around for. So the cells start out with a `blue` value of 255 (fully blue) and a `red` value of 0 (no red). On each tick a cell survives, we remove `COLOUR_STEP` from it's `blue` value and add `COLOUR_STEP` to it's red value. This allows the colour of the cells to change over time based on how many generations they have been alive for.

```Processing

    boolean alive;
    int red;
    int blue;

    // This controls how fast the cells "colour-age"
    final static int COLOUR_STEP = 2;

    Cell() {
        alive = false;
        red = 0;
        blue = 255;
    }
    
    // Draws the cell with the appropriate "colour-age" at the appropriate position
    void drawCell(int row, int col) {
        if (alive) {
            int x = row*SQUARE_SIZE;
            int y = col*SQUARE_SIZE;
            fill(red, 0, blue);
            rect(x, y, SQUARE_SIZE, SQUARE_SIZE);
        }
    }
    
    // Kill off the cell and set its "colour-age" back to fully blue
    void kill() {
        this.alive = false;
        this.red = 0;
        this.blue = 255;
    }

    // Bring the cell back to life
    void create() {
        this.alive = true;
    }

    // Age the cell from blue to red for each tick they survive.
    void age() {
        if (blue > 20) {
            this.blue -= COLOUR_STEP;
        }

        if (red < 255) {
            this.red += COLOUR_STEP;
        }
    }
}
```

# Give it a go!
That's it! Now we have our own Conway's Game of Life. I'm sure this is nothing new and that there is a tonne of them already written in Processing, but I just decided to write my own for fun! Only after I built it in Processing did I realise I could use processing.js to run it in a browser!

Feel free to play around with the simulator on [my homepage](http://stefanolupo.tech#game-of-life).
Thanks for reading! 




{% raw %}
<script type="text/javascript">
      var processingInstance;

      function start() {
        processingInstance = Processing.getInstanceById('game-of-life-canvas');
        processingInstance.startButtonPressed();
      }

      function stop() {
        processingInstance = Processing.getInstanceById('game-of-life-canvas');
        processingInstance.stopButtonPressed();
      }

      function generate() {
        processingInstance = Processing.getInstanceById('game-of-life-canvas');
        processingInstance.generateButtonPressed();
      }

    </script>
{% endraw %}