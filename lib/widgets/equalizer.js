var gainDb = -40.0;
var bandSplit = [360, 3600];

var equalizer = function(context, source) {
    var hBand = context.createBiquadFilter();
    hBand.type = 'lowshelf';
    hBand.frequency.value = bandSplit[0];
    hBand.gain.value = gainDb;

    var hInvert = context.createGain();
    hInvert.gain.value = -1.0;

    var mBand = context.createGain();

    var lBand = context.createBiquadFilter();
    lBand.type = 'highshelf';
    lBand.frequency.value = bandSplit[1];
    lBand.gain.value = gainDb;

    var lInvert = context.createGain();
    lInvert.gain.value = -1.0;

    source.connect(lBand);
    source.connect(mBand);
    source.connect(hBand);

    hBand.connect(hInvert);
    lBand.connect(lInvert);

    hInvert.connect(mBand);
    lInvert.connect(mBand);

    var lGain = context.createGain();
    var mGain = context.createGain();
    var hGain = context.createGain();

    lBand.connect(lGain);
    mBand.connect(mGain);
    hBand.connect(hGain);

    var sum = context.createGain();
    lGain.connect(sum);
    mGain.connect(sum);
    hGain.connect(sum);

    return sum;
};

function changeGain(string, type) {
    var value = parseFloat(string) / 100.0;

    switch (type) {
        case 'lowGain': lGain.gain.value = value; break;
        case 'midGain': mGain.gain.value = value; break;
        case 'highGain': hGain.gain.value = value; break;
    }
}
