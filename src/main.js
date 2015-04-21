var myMixer = mixer();

var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');


var connectPlayer = function(player, formId) {
    var form = document.getElementById(formId);
    form.audioFile.addEventListener(
        'change',
        function(e) { player.load(this.files[0]); },
        false
    );
    form.volume.addEventListener(
        'input',
        function(e) { player.volume(this.value); },
        false
    );
    form.time.addEventListener(
        'input',
        function(e) { player.time(this.value); },
        false
    );
    form.play.addEventListener(
        'click',
        function(e) { player.play(); },
        false
    );
    form.pause.addEventListener(
        'click',
        function(e) { player.pause(); },
        false
    );
    form.high.addEventListener(
        'input',
        function(e) { player.high(this.value); },
        false
    );
    form.middle.addEventListener(
        'input',
        function(e) { player.middle(this.value); },
        false
    );
    form.low.addEventListener(
        'input',
        function(e) { player.low(this.value); },
        false
    );
    form.speed.addEventListener(
        'input',
        function(e) { player.speed(this.value); },
        false
    );
    player.addTimeUpdateCallback(function() {
        form.time.max = Math.ceil(player.getDuration());
        form.time.value = Math.round(player.getTime());
    });
    player.visual.canvas(form.querySelector('.visual'));
};

connectPlayer(myMixer.player1, 'player1');
connectPlayer(myMixer.player2, 'player2');

document.getElementById('crossfader').addEventListener(
    'input',
    function(e) { myMixer.crossfader.fade(this.value); },
    false
);
