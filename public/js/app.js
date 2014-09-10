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

    var closeBtn = $('<img/>').addClass('pull-right close-btn').attr('src', '../resources/close_btn.png').click(function() {
        socket.emit('path-delete', path);
        listItem.remove();
    });

    var statusIcon = $('<img/>').addClass('pull-right status-ball').attr('src', '../resources/red_ball.png').prop('animation-active', false);


    var listItem = $('<li/>').addClass('list-group-item').text(path);

    listItem.append(closeBtn);
    listItem.append(statusIcon);

    $('#registered-paths').append(listItem);
}


function emptyPathList() {
    $('#registered-paths').empty();
}


function findListItemWith(itemText, onFind) {
    $('#registered-paths li ').each(function() {
        if ($(this).text() === itemText) {
            onFind($(this));
        }
    });
}



socket.on('start-blinking', function(path) {
    startBlinking(path);
});

socket.on('stop-blinking', function(path) {
    stopBlinking(path);
});

function startBlinking(path) {
    findListItemWith(path, function(elQ) {
        var statusBallElQ = elQ.find('.status-ball');
        if (elQ) {
            statusBallElQ.attr('src', '../resources/green_ball_anime.gif');
            function checkAnimationStatus() {
                var result = statusBallElQ.prop('animation-active');
                return result;
            }

            if (!checkAnimationStatus()) {
                statusBallElQ.prop('animation-active', true);
            }
        }
    });
}

function stopBlinking(path) {
    findListItemWith(path, function(elQ) {
        var statusBallElQ = elQ.find('.status-ball');
        if (elQ) {
            statusBallElQ.prop('animation-active', false);
            statusBallElQ.attr('src', '../resources/red_ball.png');
        }
    });
}