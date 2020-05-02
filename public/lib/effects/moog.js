/**
 * A moog effect
 * @param {object} context - the audio context
 * @param {int} size - the sample size
 * @return {object} an effect node
 */
effects.moog = function(context, size) {
    var node = context.createScriptProcessor(size, 1, 1);
    var _in1, _in2, _in3, _in4, _out1, _out2, _out3, _out4;
    _in1 = _in2 = _in3 = _in4 = _out1 = _out2 = _out3 = _out4 = 0.0;
    node.cutoff = 0.065;
    node.resonance = 3.99;

    node.onaudioprocess = function(e) {
        var _input = e.inputBuffer.getChannelData(0);
        var _output = e.outputBuffer.getChannelData(0);
        var _f = node.cutoff * 1.16;
        var _fb = node.resonance * (1.0 - 0.15 * _f * _f);
        for (var i = 0; i < size; i++) {
            _input[i] -= _out4 * _fb;
            _input[i] *= 0.35013 * (_f * _f) * (_f * _f);
            _out1 = _input[i] + 0.3 * _in1 + (1 - _f) * _out1;
            _in1 = _input[i];
            _out2 = _out1 + 0.3 * _in2 + (1 - _f) * _out2;
            _in2 = _out1;
            _out3 = _out2 + 0.3 * _in3 + (1 - _f) * _out3;
            _in3 = _out2;
            _out4 = _out3 + 0.3 * _in4 + (1 - _f) * _out4;
            _in4 = _out3;
            _output[i] = _out4;
        }
    };

    return node;
};
