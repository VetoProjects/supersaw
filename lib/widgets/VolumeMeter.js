var VolumeMeter = function(context) {
    var _node = context.createAnalyser();
    _node.fftSize = 2048;

    var _bufferLength = _node.fftSize;
    var _data = new Uint8Array(_bufferLength);
    var _callback = null;

    var update = function() {
        if (typeof _callback === 'function') {
            requestAnimationFrame(update);
            _node.getByteTimeDomainData(_data);
            var val = 0;
            for (var i = 0; i < _bufferLength; ++i)
                val += Math.abs(_data[i] - 128);
            _callback(val / _bufferLength / 128.0);
        }
    };

    _node.onupdate = function(callback) {
        _callback = callback;
        requestAnimationFrame(update);
    };

    return _node;
};
