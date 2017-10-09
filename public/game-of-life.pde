final int SQUARE_SIZE = 10;
int numRows, numCols;
Cell[][] grid;

boolean settingUp = true;

int generation = 0;
int numberAlive = 0;

void setup() {
    size(300, 300);
    numRows = width/SQUARE_SIZE;
    numCols = height/SQUARE_SIZE;
    grid = initGrid();
    generateRandomSeed();
}


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
                generateRandomSeed();
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

void startButtonPressed() {
    settingUp = false;
}

void generateButtonPressed() {
    generateRandomSeed();
}

void stopButtonPressed() {
    reset();
}

void reset() {
    settingUp = true;
    grid = initGrid();
    generation = 0;
    numberAlive = 0;
}

void applyRules() {
    Cell[][] nextGrid = initGrid();
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

Cell[][] initGrid() {
    Cell[][] grid = new Cell[numRows][numCols];
    for (int i=0; i<numRows; i++ ) {
        for (int j=0; j<numCols; j++) {
            grid[i][j] = new Cell();
        }
    }

    return grid;
}

void drawGrid() {
    background(0);
    for (int i=0; i<numRows; i++) {
        for (int j=0; j<numCols; j++) {
            Cell cell = grid[i][j];
            if (cell.alive) {
                int x = i*SQUARE_SIZE;
                int y = j*SQUARE_SIZE;
                fill(cell.red, 0, cell.blue);
                rect(x, y, SQUARE_SIZE, SQUARE_SIZE);
            }
        }
    }

/*
    fill(255, 255, 255, 200);
    rect(20, 20, 300, 100);
    fill(0);
    if (settingUp) {
        text("Use Left Mouse to populate \nUse right mouse to kill \nPress 'g' to generate a random seed \nPress 's' to start", 50, 50);
    } else {
        text("Simulation is running \nGeneration: " + generation++ + "\nNumber alive: " + numberAlive + "\nHold 'r' to reset", 50, 50);
    }
    */
}

int[] getIndex(int x, int y) {
    int[] cleanedCoords = {min(max(x, 0), width-1), min(max(y, 0), height-1) - 1};
    cleanedCoords[0] = cleanedCoords[0] / SQUARE_SIZE;
    cleanedCoords[1] = cleanedCoords[1] / SQUARE_SIZE;
    return cleanedCoords;
}

int getNumberOfNeighbours(int r, int c) {
    int numberOfNeighbours = 0;
    int count = 0;

    int rowMin = max(r-1, 0);
    int rowMax = min(r+1, numRows-1);

    int colMin = max(c-1, 0);
    int colMax = min(c+1, numCols-1);

    // println("Checking Cell (" + r + "," + c + ")");

    for (int row = rowMin; row <= rowMax; row++) {
        for (int col = colMin; col <= colMax; col++) {
            //println(count++ + ": Checking (" + x + ", " + y + ")"); 
            if (row != r || col != c) {
                if (grid[row][col].alive) {
                    numberOfNeighbours ++;
                }
            }
        }
    }

    return numberOfNeighbours;
}

void generateRandomSeed() {
    for (int i=0; i<numRows; i++) {
        for (int j=0; j<numCols; j++) {
            float r = random(1);
            if (r > 0.8) {
                grid[i][j].alive = true;
            } else {
                grid[i][j].alive = false;
            }
        }
    }
}










class Cell {
    boolean alive;
    int red;
    int blue;
    
    final static int COLOUR_STEP = 2;

    Cell() {
        alive = false;
        red = 0;
        blue = 255;
    }

    void kill() {
        this.alive = false;
        this.red = 0;
        this.blue = 255;
    }

    void create() {
        this.alive = true;
    }

    void age() {
        if (blue > 20) {
            this.blue -= COLOUR_STEP;
        }
        
        if (red < 255) {
            this.red += COLOUR_STEP;
        }
    }
}
