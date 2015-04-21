/*
File -> speedControl -> pitch -> effect -> equalizer -> volume -> gain -> out
            |
            v
        visualizer
*/

var player = function(context) {
    var node = {
        audio: context.createGain(),
        visual: analyzer(context)
    };
    var _audioTag = new Audio(),
        _audioNode = context.createMediaElementSource(_audioTag),
        _speed = 1.0,
        _pitch = pitch(context),
        _effect = null,
        _equalizer = equalizer(context, _pitch),
        _volume = context.createGain();

    _pitch.transpose = 0;

    // no effect by default
    _audioNode.connect(node.visual);
    _audioNode.connect(_pitch);
    _pitch.connect(_equalizer.source);
    _equalizer.connect(_volume);
    _volume.connect(node.audio);

    node.load = function(file) {
        console.log('load file: ' + URL.createObjectURL(file));
        _audioTag.pause();
        _audioTag.setAttribute('src', URL.createObjectURL(file));
        _audioTag.defaultPlaybackRate = _audioTag.playbackRate = _speed;
        _audioTag.play();
    };

    node.volume = function(value) {
        _volume.gain.value = Math.min(1, Math.max(0, value));
    };

    node.pitch = function(value) {
        _pitch.transpose = Math.round(parseFloat(value));
    };

    node.play = function() {
        _audioTag.play();
    };

    node.pause = function() {
        _audioTag.pause();
    };

    node.gain = function(value) {
        node.audio.gain.value = value;
    };

    node.effect = function(effectFn) {
        if (effectFn) {
            var effect = effectFn(context, 2048);
            effect.connect(_equalizer.source);
            _pitch.disconnect();
            _pitch.connect(effect);
        } else {
            _pitch.connect(_equalizer.source);
        }
        if (_effect && _effect.disconnect) {
            _effect.disconnect();
            _effect = null;
        }
        _effect = effect || null;
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
        _audioTag.defaultPlaybackRate = _audioTag.playbackRate = _speed;
    };
    node.getTime = function() {
        return _audioTag.currentTime;
    };
    node.getDuration = function() {
        return _audioTag.duration;
    };
    node.addTimeUpdateCallback = function(callback) {
        _audioTag.addEventListener('timeupdate', callback, false);
    };
    node.time = function(value) {
        _audioTag.currentTime = value;
    };

    return node;
};
