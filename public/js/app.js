var socket = io.connect('http://localhost:8085');

$('#submit-path').click(function() {
    var inputPath = $('input[name="input-path"]').val();
    socket.emit("path-entry", inputPath);
    $('input[name="input-path"]').val('');
});