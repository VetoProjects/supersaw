var GAINDB = -40.0;
var BANDSPLIT = [360, 3600];

var equalizer = function(context) {
    var sum = context.createGain();
    sum.source = context.createGain();

    var _hBand = context.createBiquadFilter();
    _hBand.type = 'lowshelf';
    _hBand.frequency.value = BANDSPLIT[0];
    _hBand.gain.value = GAINDB;

    var _hInvert = context.createGain();
    _hInvert.gain.value = -1.0;

    var _mBand = context.createGain();

    var _lBand = context.createBiquadFilter();
    _lBand.type = 'highshelf';
    _lBand.frequency.value = BANDSPLIT[1];
    _lBand.gain.value = GAINDB;

    var _lInvert = context.createGain();
    _lInvert.gain.value = -1.0;

    sum.source.connect(_lBand);
    sum.source.connect(_mBand);
    sum.source.connect(_hBand);

    _hBand.connect(_hInvert);
    _lBand.connect(_lInvert);

    _hInvert.connect(_mBand);
    _lInvert.connect(_mBand);

    var _lGain = context.createGain();
    var _mGain = context.createGain();
    var _hGain = context.createGain();

    _lBand.connect(_lGain);
    _mBand.connect(_mGain);
    _hBand.connect(_hGain);


    _lGain.connect(sum);
    _mGain.connect(sum);
    _hGain.connect(sum);


    sum.changeGain = function(type, string) {
        var _value = parseFloat(string);

        switch (type) {
            case 'lowGain': _lGain.gain.value = _value; break;
            case 'midGain': _mGain.gain.value = _value; break;
            case 'highGain': _hGain.gain.value = _value; break;
        }
    };

    return sum;
};
