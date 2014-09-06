var socket = io.connect('http://localhost:8085');

socket.on("register-path", function(data) {
    addRow(data);
});

socket.on('disconnect', function() {
    emptyPathList();
});

socket.on("initializeList", function(data) {
    emptyPathList();
    data.forEach(function(path) {
        addRow(path);
    });
});

$('#submit-path').click(function(e) {
    e.preventDefault();
    var inputPath = $('input[name="input-path"]').val();
    socket.emit("path-entry", inputPath);
    $('input[name="input-path"]').val('');
});


function addRow(path) {
    var listItem = $('<li/>').addClass('list-group-item').text(path);

    var closeBtn = $('<button/>').addClass('pull-right close-btn').text(htmlDecode('&#10006;')).click(function() {
        socket.emit('path-delete', path);
        listItem.remove();
    });

    var listItem = $('<li/>').addClass('list-group-item').text(path);

    listItem.append(closeBtn);
    $('#registered-paths').append(listItem);
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}


function emptyPathList() {
    $('#registered-paths').empty();
}




