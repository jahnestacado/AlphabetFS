function areArrayContentsEqual(a1, a2) {
    var areEqual = a1.length === a2.length;
    if (areEqual) {
        a1.sort();
        a2.sort();
        a1.forEach(function(element) {
            var index = a1.indexOf(element);
            areEqual = element === a2[index] && areEqual;
        });
        return areEqual;
    } else {
        return areEqual;
    }
}

exports.areArrayContentsEqual = areArrayContentsEqual;