var bus = require('hermes-bus');

var pathsInBlinkingState = [];

function handleBlinkingState(event, path) {
    var index = pathsInBlinkingState.indexOf(path);
    if (event === 'start-blinking' && index === -1) {
        pathsInBlinkingState.push(path);
    } else if (event === 'stop-blinking') {
        pathsInBlinkingState.splice(index, 1);
    }
}

function initStatusOfBalls() {
    pathsInBlinkingState.forEach(function(path) {
        bus.socket.emitUIEvent("start-blinking", path);
    });
}

bus.onEvent("socket", "UIEvent", function(event, path) {
    handleBlinkingState(event, path);
}).registerLocation(__filename);

bus.onEvent("socket", 'initStatusOfBalls', function() {
    initStatusOfBalls();
});

bus.onEvent('db', 'deletePath', function(path) {
    var index = pathsInBlinkingState.indexOf(path);
    pathsInBlinkingState.splice(index, 1);
}).registerLocation(__filename);