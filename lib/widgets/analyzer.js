var analyzer = function(context) {
    var _node = context.createAnalyser(),
        _canvas = null,
        _canvasCtx = null;
    _node.fftSize = 2048;

    var _bufferLength = _node.fftSize;
    var _dataArray = new Uint8Array(_bufferLength);


    _node.canvas = function(canvas) {
        if (canvas.localName !== 'canvas') return;
        if (_canvas === null) requestAnimationFrame(_node.draw);
        _canvas = canvas;
        _canvasCtx = _canvas.getContext('2d');
        _canvasCtx.clearRect(0, 0, _canvas.width, _canvas.height);
    };

    _node.draw = function() {
        if (_canvas === null) return;

        var _width = _canvas.width,
            _height = _canvas.height;

        requestAnimationFrame(_node.draw);
        _node.getByteTimeDomainData(_dataArray);

        _canvasCtx.fillStyle = 'rgb(50, 50, 50)';
        _canvasCtx.fillRect(0, 0, _width, _height);

        _canvasCtx.lineWidth = 2;
        _canvasCtx.strokeStyle = 'rgb(0, 200, 0)';
        _canvasCtx.beginPath();

        var _sliceWidth = _width * 1.0 / _bufferLength;
        var _x = 0;

        for (var i = 0; i < _bufferLength; i++) {
            var _v = _dataArray[i] / 128.0;
            var _y = _v * _height / 2;

            if (i === 0) _canvasCtx.moveTo(_x, _y);
            else _canvasCtx.lineTo(_x, _y);

            _x += _sliceWidth;
        }
        _canvasCtx.lineTo(_width, _height / 2);
        _canvasCtx.stroke();
    };

    return _node;
};
