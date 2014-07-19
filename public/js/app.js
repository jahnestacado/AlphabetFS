var socket = io.connect('http://localhost:8085');

$('#submit-path').click(function(e) {
    e.preventDefault();
    var inputPath = $('input[name="input-path"]').val();
    socket.emit("path-entry", inputPath);
    $('input[name="input-path"]').val('');
});



socket.on("register-path", function(data) {
    $('#registered-paths').append("<li class='list-group-item' >" + data + "</li>");
});