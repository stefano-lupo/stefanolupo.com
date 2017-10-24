

<script src="https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.6.6/processing.min.js"></script>

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

<div id="canvas-container">
    <canvas id="game-of-life-canvas" data-processing-sources="game-of-life.pde"></canvas>
    <br>
    <br>
    <button onClick="generate()">Generate</button>
    <button onClick="start()">Start</button>
    <button onClick="stop()">Stop</button>
</div>