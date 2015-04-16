/*
File -> speedControl -> pitch -> effect -> equalizer -> volume -> gain -> out
*/

var player = function(context) {
    var node = { audio: context.createGain() },
        _audioFile = null,
        _speed = 1.0,
        _pitch = context.createGain(),
        _effect = null,
        _equalizer = equalizer(context, _pitch),
        _volume = context.createGain();

    // no effect by default
    _pitch.connect(_equalizer.source);
    _equalizer.connect(_volume);
    _volume.connect(node.audio);

    node.load = function(file) {
        if (_audioFile && _audioFile.stop) {
            _audioFile.stop();
            _audioFile = null;
        }
        _audioFile = context.createBufferSource();
        _audioFile.playbackRate.value = _speed;
        _audioFile.connect(_pitch);
        console.log('load file: ' + file);
        var reader = new FileReader();
        reader.onload = function(e) {
            console.log('file loaded');
            context.decodeAudioData(e.target.result, function(buffer) {
                _audioFile.buffer = buffer;
                _audioFile.start(0);
                console.log('start playing.');
            }, function(e) {
                console.log('Error decoding file', e);
            });
        };
        reader.readAsArrayBuffer(file);
    };

    node.volume = function(value) {
        _volume.gain.value = Math.min(1, Math.max(0, value));
    };

    node.gain = function(value) {
        node.audio.gain.value = value;
    };

    node.effect = function(effect) {
        if (effect.connect) {
            effect.connect(equalizer);
            _pitch.disconnect();
            _pitch.connect(effect);
        } else {
            _pitch.connect(_equalizer.source);
        }
        if (_effect.disconnect) {
            _effect.disconnect();
            _effect = null;
        }
        _efffect = effect;
    };

    node.high = function(value) {
        _equalizer.changeGain('highGain', value);
    };
    node.middle = function(value) {
        _equalizer.changeGain('midGain', value);
    };
    node.low = function(value) {
        _equalizer.changeGain('lowGain', value);
    };

    node.speed = function(value) {
        _speed = value;
        if (_audioFile) _audioFile.playbackRate.value = _speed;
    };

    return node;
};
