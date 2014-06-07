var fs = require('fs');


function onTransferFinished(fullpath, callback) {
    var oldSize = 0;

    function listenUntilIsDone() {

        if (fs.existsSync(fullpath)) {
            if (isADirectory(fullpath)) {
                var size = getSizeSnapshot(fullpath);
                console.log("Sizeee ", size + " path: ", fullpath);
                if (size > 0 && oldSize === size) {
                    console.log("Callback ");
                    callback();
                    return;
                }
                else {
                    console.log("Size " + size + " Oldize " + oldSize);
                    console.log("Call again ");

                    oldSize = size;
                    setTimeout(listenUntilIsDone, 3000);
                }
            }
            else {
                console.log("There ",fullpath);
                callback();
            }
        }
    }

    listenUntilIsDone();
}




function getSingleFileSize(filename) {
      console.log("Daaa   ", filename);
    var exists = fs.existsSync(filename);
    if (exists) {
        return fs.statSync(filename).size;
    }
    return 0;
}


function isADirectory(path) {
    return getSingleFileSize(path) === 4096;
}





function getSizeSnapshot(path) {
    if (isADirectory(path)) {
        var content = fs.readdirSync(path);
        var size = content.reduce(function(total, file) {
            return total + getSizeSnapshot(path + '/' + file);
        }, 0)
        return size;
    }
    else
        return getSingleFileSize(path);
}

exports.onTransferFinished = onTransferFinished;