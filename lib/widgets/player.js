/*
File -> speedControl -> pitch -> effect -> equalizer -> volume -> gain -> out
*/


player = function(context) {
    var node = { audio: context.createGain() },
        _audioFile = null,
        _speed = context.createGain(),
        _pitch = context.createGain(),
        _effect = null,
        _equalizer = equalizer(context, _pitch),
        _volume = context.createGain();

    _speed.connect(_pitch);
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
        _audioFile.connect(_speed);
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

        _audioFile.connect(_speed);
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
            _ptich.connect(_equalizer.source);
        }
        if (_effect.disconnect) {
            _effect.disconnect();
            _effect = null;
        }
        _efffect = effect;
    };

    return node;
};
