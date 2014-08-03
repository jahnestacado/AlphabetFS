var socket = io.connect('http://localhost:8085');

$('#submit-path').click(function(e) {
    e.preventDefault();
    var inputPath = $('input[name="input-path"]').val();
    socket.emit("path-entry", inputPath);
    $('input[name="input-path"]').val('');
});


socket.on("register-path", function(data) {
    addRegisteredDirRow(data);
});


function addRegisteredDirRow(path) {
    var closeBtn = $('<button/>').addClass('pull-right close-btn').text(htmlDecode('&#10006;')).click(function() {
        alert(path);
    });

    var listItem = $('<li/>').addClass('list-group-item').text(path);
    
    listItem.append(closeBtn);
    $('#registered-paths').append(listItem);
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
};


socket.on("init", function(data) {
    $('#registered-paths').empty();
    data.forEach(function(path) {
        addRegisteredDirRow(path);
    })
});



