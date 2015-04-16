var myMixer = mixer();

document.querySelector('#player1 .audioFile').addEventListener(
    'change',
    function(e) { myMixer.player1.load(this.files[0]); },
    false
);
document.querySelector('#player1 .volume').addEventListener(
    'input',
    function(e) { myMixer.player1.volume(this.value / this.max); },
    false
);
document.querySelector('#player1 .high').addEventListener(
    'input',
    function(e) { myMixer.player1.high(this.value / this.max); },
    false
);
document.querySelector('#player1 .middle').addEventListener(
    'input',
    function(e) { myMixer.player1.middle(this.value / this.max); },
    false
);
document.querySelector('#player1 .low').addEventListener(
    'input',
    function(e) { myMixer.player1.low(this.value / this.max); },
    false
);



document.querySelector('#player2 .audioFile').addEventListener(
    'change',
    function(e) { myMixer.player2.load(this.files[0]); },
    false
);
document.querySelector('#player2 .volume').addEventListener(
    'input',
    function(e) { myMixer.player2.volume(this.value / this.max); },
    false
);
document.querySelector('#player2 .high').addEventListener(
    'input',
    function(e) { myMixer.player2.high(this.value / this.max); },
    false
);
document.querySelector('#player2 .middle').addEventListener(
    'input',
    function(e) { myMixer.player2.middle(this.value / this.max); },
    false
);
document.querySelector('#player2 .low').addEventListener(
    'input',
    function(e) { myMixer.player2.low(this.value / this.max); },
    false
);


document.querySelector('#crossfader').addEventListener(
    'input',
    function(e) { myMixer.crossfader.fade((this.value / this.max) * 2 - 1); },
    false
);
