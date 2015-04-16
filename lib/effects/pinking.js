/**
 * A pinking effect
 * @param {object} context - the audio context
 * @param {int} size - the sample size
 * @return {object} an effect node
 */
effects.pinking = function(context, size) {
    var _b0, _b1, _b2, _b3, _b4, _b5, _b6;
    _b0 = _b1 = _b2 = _b3 = _b4 = _b5 = _b6 = 0.0;
    var _node = context.createScriptProcessor(size, 1, 1);

    node.onaudioprocess = function(e) {
        var _input = e.inputBuffer.getChannelData(0);
        var _output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < size; i++) {
            _b0 = 0.99886 * _b0 + _input[i] * 0.0555179;
            _b1 = 0.99332 * _b1 + _input[i] * 0.0750759;
            _b2 = 0.96900 * _b2 + _input[i] * 0.1538520;
            _b3 = 0.86650 * _b3 + _input[i] * 0.3104856;
            _b4 = 0.55000 * _b4 + _input[i] * 0.5329522;
            _b5 = -0.7616 * _b5 - _input[i] * 0.0168980;
            _output[i] = _b0 + _b1 + _b2 + _b3 + _b4 + _b5 + _b6 + _input[i] * 0.5362;
            _output[i] *= 0.11;
            _b6 = _input[i] * 0.115926;
        }
    };

    return node;
};
