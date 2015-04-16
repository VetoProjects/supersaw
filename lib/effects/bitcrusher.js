var bitcrusher = function(context, size) {
    var node = context.createScriptProcessor(size, 1, 1);
    node.bits = 4;
    node.normfreq = 0.1;
    var _step = Math.pow(1 / 2, node.bits);
    var _phaser = 0;
    var _last = 0;

    node.onaudioprocess = function(e) {
        var _input = e.inputBuffer.getChannelData(0);
        var _output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < size; i++) {
            _phaser += node.normfreq;
            if (_phaser >= 1.0) {
                _phaser -= 1.0;
                _last = _step * Math.floor(_input[i] / _step + 0.5);
            }
            _output[i] = _last;
        }
    };

    return node;
};
