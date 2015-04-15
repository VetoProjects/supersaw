var myMixer = mixer();
document.getElementById('audioFile1').addEventListener(
    'change',
    function(e) { myMixer.player1.load(this.files[0]); },
    false
);
document.getElementById('audioFile2').addEventListener(
    'change',
    function(e) { myMixer.player2.load(this.files[0]); },
    false
);
