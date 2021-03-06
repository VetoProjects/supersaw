var sliders = document.querySelectorAll('input[type=range]');
for (var i = 0; i < sliders.length; ++i) {
    sliders[i].addEventListener(
        'dblclick',
        function() {
            this.value = this.defaultValue;
            this.dispatchEvent(new Event('input'));
        },
        false
    );
}

var connectPlayer = function(player, formId) {
    var form = document.getElementById(formId);
    form.audioFile.addEventListener(
        'change',
        function(e) { player.load(this.files[0]); },
        false
    );
/*document.getElementById('my_file1').addEventListener('change', function() { loadfile(this, audio.sample[0], document.getElementById('filename1')); } , false);
/*document.getElementById('audiofile2').addEventListener('change', function() { loadfile(this, audio.sample[1], document.getElementById('filename2')); } , false);*/
/*document.getElementById('filechooser1').addEventListener('click', function() { document.getElementById('my_file1').click(); } , false);*/
document.getElementById('filechooser1').onclick = function() {
document.getElementById('my_file1').click();
};
document.getElementById('filechooser2').onclick = function() {
document.getElementById('my_file2').click();
};
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
        function(e) {
          player.pitch(this.value);
        },
        false
    );

    for (const key in effects) {
        form.effects.appendChild(new Option(key));
    }

    player.addTimeUpdateCallback(function() {
        form.time.max = Math.ceil(player.getDuration());
        form.time.value = Math.round(player.getTime());
    });

    player.visual.canvas(form.querySelector('.visual'));
};

document.getElementById('learnButton').addEventListener('click', function() {
    if (midi.isLearning()) {
        midi.stopLearning();
        this.value = 'Start Learning';
    } else {
        midi.startLearning();
        this.value = 'Stop Learning';
    }
});
midi.onmessage = function(msg) {
    var span = document.getElementById('learnMessage');
    span.innerHTML = msg;

    setTimeout(function() {
      span.innerHTML = '';
    }, 5000);
};

const initMixer = () => {
    window.removeEventListener('click', initMixer);
    window.removeEventListener('touchstart', initMixer);

    var myMixer = mixer();

    connectPlayer(myMixer.player1, 'player1');
    connectPlayer(myMixer.player2, 'player2');

    myMixer.player1.volumeMeter.onupdate(midi.leftBar);
    myMixer.player2.volumeMeter.onupdate(midi.rightBar);

    document.getElementById('crossfader').addEventListener(
      'input',
      function (e) { myMixer.crossfader.fade(this.value); },
      false
    );
};

window.addEventListener('click', initMixer, true);
window.addEventListener('touchstart', initMixer, true);
