/**
    onmessage: Callback function to show the user a message.
 **/
var midi = {
    onmessage: function() { }
};

if (navigator.requestMIDIAccess) {
    var _controllMap = { };
    var _learning = false;
    var _learnSource = null; // Midi signal
    var _learnTarget = null; // DOM element

    var userMessage = function(msg) {
        if (typeof midi.onmessage === 'function') {
            midi.onmessage(msg);
        }
    }

    midi.isLearning = function() {
        return _learning;
    }
midi.controllMap = _controllMap;
    midi.startLearning = function() {
        _learning = true;
        _learnSource = { };
        _learnTarget = { };
        userMessage('Learning ...');
    };

    midi.stopLearning = function() {
        _learning = false;
        if (_learnSource.type && _learnSource.type == _learnTarget.type) {
            if (!_controllMap[_learnSource.elem] || confirm('Replace old midi binding?')) {
                _controllMap[_learnSource.elem] = _learnTarget.elem;
                userMessage('Midi controll maped successful.');
            }
        } else {
            userMessage('Typs of source and target do not match.');
        }
    };

    var sliderMoved = function() {
        if (_learning){
            _learnTarget = {
                type: 'slider',
                elem: this
            };
        }
    };

    var buttonClicked = function() {
        if (_learning) {
            _learnTarget = {
                type: 'button',
                elem: this
            };
        }
    };

    var init = function() {
        var buttons = document.querySelectorAll('button:not(#learnButton), input[type=button]');
        for(var i = 0; i < buttons.length; ++i) {
            buttons[i].addEventListener('click', buttonClicked);
        }

        var sliders = document.querySelectorAll('input[type=range]');
        for(var i = 0; i < sliders.length; ++i) {
            sliders[i].addEventListener('input', sliderMoved);
        }
    };

    var processSliderMessage = function(msg) {
        var address = msg.srcElement.id + '/' + msg.data[0] + '/' + msg.data[1];
        var elem = _controllMap[address];

        if (elem) {
            var min = parseFloat(elem.min);
            var max = parseFloat(elem.max);
            elem.value = (msg.data[2] / 127.0) * (max - min) + min;
            elem.dispatchEvent(new Event('input'));
        }

        if (_learning) {
            _learnSource = {
                type: 'slider',
                elem: address
            };
        }
    };

    /**
     down: true if button pressed, false if button released
     **/
    var processButtonMessage = function(down, msg) {
        var address = msg.srcElement.id + '/' + msg.data[0] + '/' + msg.data[1];
        var elem = _controllMap[address];

        if (elem) {
            elem.click();
        }

        if (_learning) {
            _learnSource = {
                type: 'button',
                elem: address
            };
        }
    };

    var processMessage = function(msg) {
        var t = (msg.data[0] >> 4);
        if (t == 0x9) processButtonMessage(true, msg);
        if (t == 0x8) processButtonMessage(false, msg);
        if (t == 0xB) processSliderMessage(msg);
    };

    var requestSuccess = function(MIDIAccess) {
        var inputs = MIDIAccess.inputs;
        if(inputs.size <= 0) {
            console.log('No MIDI controller found.');
        } else {
            for (var input of inputs.values()) {
                console.log(input);
                input.addEventListener('midimessage', processMessage);
                /*
                for (var output of MIDIAccess.outputs.values()) {
                    if(output.name === input.name){
                        midiIn = input;
                        midiOut = output;
                        console.log(midiOut);
                        var out = output;
                        for(var i = 0x80; i < 0x90; ++i){
                            for(var j = 0x00; j < 0x80; ++j){
                                for(var k = 0x00; k < 0x80; ++k){
                                    setTimeout(midi_curry(i,j,k,out), ((i - 0x90)) * 1000);
                                }
                            }
                        }
                    }
                }
                */
            }
        }
    };

    var requestError = function() {
        console.log('Midi access denied.');
    };

    navigator.requestMIDIAccess().then(requestSuccess, requestError);
    window.addEventListener('DOMContentLoaded', init);
} else {
    console.log('Midi API not found.');
}

/*
function midi_curry(x,y,z,out){
    return function(){
        out.send([x,y,z]);
        console.log([x,y,z]);
    }
}
*/
