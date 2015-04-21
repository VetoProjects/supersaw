var myMixer = mixer();

var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');
var inputs = null;

navigator.requestMIDIAccess()
  .then(function(MIDIAccess) {
    inputs = MIDIAccess.inputs.values();

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      input.value.addEventListener('midimessage', function(val) {
        console.log(val);
      });
    }
  }, function(e) {
    alert(e);
});


var connectPlayer = function(player, formId) {
    form = document.getElementById(formId);
    form.audioFile.addEventListener(
        'change',
        function(e) { player.load(this.files[0]); },
        false
    );
    form.volume.addEventListener(
        'input',
        function(e) { player.volume(this.value / this.max); },
        false
    );
    // Time
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
        function(e) { player.high(this.value / this.max); },
        false
    );
    form.middle.addEventListener(
        'input',
        function(e) { player.middle(this.value / this.max); },
        false
    );
    form.low.addEventListener(
        'input',
        function(e) { player.low(this.value / this.max); },
        false
    );
    form.speed.addEventListener(
        'input',
        function(e) { player.speed(this.value / 100.0); },
        false
    );
    form.effects.addEventListener(
        'change',
        function(e) {
          var i = this.options[this.selectedIndex].value;
          player.effect(effects[i] || null);
        },
        false
    );

    for (key in effects) {
        form.effects.appendChild(new Option(key));
    }

    player.visual.canvas(form.querySelector('.visual'));
};

connectPlayer(myMixer.player1, 'player1');
connectPlayer(myMixer.player2, 'player2');

document.getElementById('crossfader').addEventListener(
    'input',
    function(e) { myMixer.crossfader.fade((this.value / this.max) * 2 - 1); },
    false
);
