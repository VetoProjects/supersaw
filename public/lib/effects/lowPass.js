/**
 * A lowpass effect
 * @param {object} context - the audio context
 * @param {int} size - the sample size
 * @return {object} an effect node
 */
effects.lowPass = function(context, size) {
    var _lastOut = 0.0;
    var node = context.createScriptProcessor(size, 1, 1);

    node.onaudioprocess = function(e) {
        var _input = e.inputBuffer.getChannelData(0);
        var _output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < size; i++) {
            _output[i] = (_input[i] + _lastOut) / 2.0;
            _lastOut = _output[i];
        }
    };

    return node;
};
