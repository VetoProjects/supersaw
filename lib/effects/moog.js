var moog = function(size) {
    var node = audioContext.createScriptProcessor(size, 1, 1);
    var in1, in2, in3, in4, out1, out2, out3, out4;
    in1 = in2 = in3 = in4 = out1 = out2 = out3 = out4 = 0.0;
    node.cutoff = 0.065;
    node.resonance = 3.99;
    node.onaudioprocess = function(e) {
        var input = e.inputBuffer.getChannelData(0);
        var output = e.outputBuffer.getChannelData(0);
        var f = node.cutoff * 1.16;
        var fb = node.resonance * (1.0 - 0.15 * f * f);
        for (var i = 0; i < size; i++) {
            input[i] -= out4 * fb;
            input[i] *= 0.35013 * (f * f) * (f * f);
            out1 = input[i] + 0.3 * in1 + (1 - f) * out1;
            in1 = input[i];
            out2 = out1 + 0.3 * in2 + (1 - f) * out2;
            in2 = out1;
            out3 = out2 + 0.3 * in3 + (1 - f) * out3;
            in3 = out2;
            out4 = out3 + 0.3 * in4 + (1 - f) * out4;
            in4 = out3;
            output[i] = out4;
        }
    };
    return node;
};
