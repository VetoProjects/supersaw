var myMixer = mixer();

var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');

player.audioFile.addEventListener(
    'change',
    function(e) { myMixer.player1.load(this.files[0]); },
    false
);
layer1.volume.addEventListener(
    'input',
    function(e) { myMixer.player1.volume(this.value / this.max); },
    false
);
player1.high.addEventListener(
    'input',
    function(e) { myMixer.player1.high(this.value / this.max); },
    false
);
layer1.middle.addEventListener(
    'input',
    function(e) { myMixer.player1.middle(this.value / this.max); },
    false
);
player1.low.addEventListener(
    'input',
    function(e) { myMixer.player1.low(this.value / this.max); },
    false
);

player2.audioFile.addEventListener(
    'change',
    function(e) { myMixer.player2.load(this.files[0]); },
    false
);
player2.volume.addEventListener(
    'input',
    function(e) { myMixer.player2.volume(this.value / this.max); },
    false
);
player2.high.addEventListener(
    'input',
    function(e) { myMixer.player2.high(this.value / this.max); },
    false
);
player2.middle.addEventListener(
    'input',
    function(e) { myMixer.player2.middle(this.value / this.max); },
    false
);
player2.low.addEventListener(
    'input',
    function(e) { myMixer.player2.low(this.value / this.max); },
    false
);

document.getElementById('crossfader').addEventListener(
    'input',
    function(e) { myMixer.crossfader.fade((this.value / this.max) * 2 - 1); },
    false
);
