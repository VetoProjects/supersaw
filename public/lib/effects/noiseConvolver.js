/**
 * A convolver effect
 * @param {object} context - the audio context
 * @return {object} an effect node
 */
effects.convolver = function(context) {
    var convolve = context.createConvolver(),
    _noiseBuffer = context.createBuffer(2, 0.5 * context.sampleRate, context.sampleRate),
    _left = _noiseBuffer.getChannelData(0),
    _right = _noiseBuffer.getChannelData(1);
    for (var i = 0; i < _noiseBuffer.length; i++) {
        _left[i] = Math.random() * 2 - 1;
        _right[i] = Math.random() * 2 - 1;
    }
    convolve.buffer = _noiseBuffer;
    return convolve;
};
