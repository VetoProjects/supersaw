var lowPass = function(size) {
    var lastOut = 0.0;
    var node = audioContext.createScriptProcessor(size, 1, 1);
    node.onaudioprocess = function(e) {
        var input = e.inputBuffer.getChannelData(0);
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < size; i++) {
            output[i] = (input[i] + lastOut) / 2.0;
            lastOut = output[i];
        }
    }
    return node;
};
