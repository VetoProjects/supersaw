var crossfader = function(context, audio1, audio2) {
    var node = { audio: context.createGain() };

    var _gain1 = context.createGain(),
        _gain2 = context.createGain();

    audio1.connect(_gain1);
    audio2.connect(_gain2);

    _gain1.connect(node.audio);
    _gain2.connect(node.audio);


    node.fade = function(value) {
        value = Math.min(1, Math.max(0, (parseFloat(value) + 1) / 2));
        _gain1.gain.value = Math.cos(value * 0.5 * Math.PI);
        _gain2.gain.value = Math.cos((1 - value) * 0.5 * Math.PI);
    };
    node.gain = function(value) {
        _out.gain.value = value;
    };

    return node;
};
