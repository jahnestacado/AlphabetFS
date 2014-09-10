var bus = require('hermes-bus');

var pathsInBlinkingState = [];

function handleBlinkingState(eventData) {
    var index = pathsInBlinkingState.indexOf(eventData.path);
    if (eventData.event === 'start-blinking' && index === -1) {
        pathsInBlinkingState.push(eventData.path);
    } else if (eventData.event === 'stop-blinking') {
        pathsInBlinkingState.splice(index, 1);
    }
}

function initStatusOfBalls() {
    pathsInBlinkingState.forEach(function(path) {
        bus.socket.emitUIEvent({event: 'start-blinking', path: path});
    });
}

bus.onEvent("socket", "UIEvent", function(data) {
    handleBlinkingState(data);
}).registerLocation(__filename);

bus.onEvent("socket", 'initStatusOfBalls', function() {
    initStatusOfBalls();
});

bus.onEvent('db', 'deletePath', function(path) {
    var index = pathsInBlinkingState.indexOf(path);
    pathsInBlinkingState.splice(index, 1);
}).registerLocation(__filename);