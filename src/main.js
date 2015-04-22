var myMixer = mixer();

var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');
var inputs = null;

function midi_curry(x, y, z, out) {
    return function() {
        out.send([x, y, z]);
        console.log([x, y, z]);
    }
}

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(function(MIDIAccess) {
            var inputs = MIDIAccess.inputs.values();
            for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
                console.log(input);
                var outputs = MIDIAccess.outputs.values();
                for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
                    if (output.value.name === input.value.name) {
                        var out = output.value;
                        console.log(out);
                        /*for (var i = 0xB0; i < 0xBF; ++i) {
                            for (var j = 0; j < 0x7F; ++j) {
                                for (var k = 0x7F; k < 0x80; k += 13) {
                                    setTimeout(midi_curry(i, j, k, out), ((i - 0xB0)) * 1000);
                                }
                            }
                        }*/
                        input.value.addEventListener('midimessage', function(val) {
                            console.log(val.data);
                            out.send(val.data);
                        });
                    }
                }
            }
        }, function(e) {
            alert(e);
        });
}


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
    form.effects.addEventListener(
        'change',
        function(e) {
          var i = this.options[this.selectedIndex].value;
          player.effect(effects[i] || null);
        },
        false
    );
    form.pitch.addEventListener(
        'input',
        function(e) { player.pitch(this.value); },
        false
    );

    for (key in effects) {
        form.effects.appendChild(new Option(key));
    }

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
