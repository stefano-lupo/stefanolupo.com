/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function () {
    var heights = $(".equal-height").map(function () {
            return $(this).height();
        }).get(),

        maxHeight = Math.max.apply(null, heights);

    $(".equal-height").height(maxHeight);
});

$(document).ready(function () {
     var canvasWidth = $('#canvas-container').width();
    $('#game-of-life-canvas').width(canvasWidth);
});
