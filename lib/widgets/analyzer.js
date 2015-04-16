var analyzer = function(context, canvas, width, height) {
  var node = context.createAnalyse();
  node.fftSize = 2048;

  var _bufferLength = analyser.fftSize;
  var _dataArray = new Uint8Array(_bufferLength);

  canvas.clearRect(0, 0, width, height);

  var _draw = function() {
    var _drawVisual = requestAnimationFrame(_draw);
    analyser.getByteTimeDomainData(_dataArray);

    canvas.fillStyle = 'rgb(0, 0, 0)';
    canvas.fillRect(0, 0, width, height);

    canvas.lineWidth = 2;
    canvas.strokeStyle = 'rgb(0, 200, 0)';
    canvas.beginPath();

    var _sliceWidth = width * 1.0 / _bufferLength;
    var _x = 0;

    for (var i = 0; i < _bufferLength; i++) {
      var _v = _dataArray[i] / 128.0;
      var _y = _v * height / 2;

      if (i === 0) canvas.moveTo(_x, _y);
      else canvas.lineTo(_x, _y);

      _x += _sliceWidth;
    }
    canvas.lineTo(canvas.width, canvas.height / 2);
    canvas.stroke();
  };

  _draw();
};
