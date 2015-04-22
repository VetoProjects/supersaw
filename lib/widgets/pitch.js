var _pitchUtils = {};

// include https://github.com/cwilso/Audio-Input-Effects/blob/master/js/jungle.js

// Copyright 2012, Google Inc.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//     * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

_pitchUtils.createFadeBuffer = function(context, activeTime, fadeTime) {
    var length1 = activeTime * context.sampleRate;
    var length2 = (activeTime - 2 * fadeTime) * context.sampleRate;
    var length = length1 + length2;
    var buffer = context.createBuffer(1, length, context.sampleRate);
    var p = buffer.getChannelData(0);

    var fadeLength = fadeTime * context.sampleRate;

    var fadeIndex1 = fadeLength;
    var fadeIndex2 = length1 - fadeLength;

    for (var i = 0; i < length1; ++i) {
        var value;

        if (i < fadeIndex1) value = Math.sqrt(i / fadeLength);
        else if (i >= fadeIndex2) value = Math.sqrt(1 - (i - fadeIndex2) / fadeLength);
        else value = 1;

        p[i] = value;
    }

    for (var i = length1; i < length; ++i) p[i] = 0;


    return buffer;
};

_pitchUtils.createDelayTimeBuffer = function(context, activeTime, fadeTime, shiftUp) {
    var length1 = activeTime * context.sampleRate;
    var length2 = (activeTime - 2 * fadeTime) * context.sampleRate;
    var length = length1 + length2;
    var buffer = context.createBuffer(1, length, context.sampleRate);
    var p = buffer.getChannelData(0);

    for (var i = 0; i < length1; ++i) {
        if (shiftUp) p[i] = (length1 - i) / length;
        else p[i] = i / length1;
    }

    for (var i = length1; i < length; ++i) p[i] = 0;

    return buffer;
};

_pitchUtils.delayTime = 0.100;
_pitchUtils.fadeTime = 0.050;
_pitchUtils.bufferTime = 0.100;

_pitchUtils.Jungle = function(context) {
    this.context = context;
    var input = context.createGain();
    var output = context.createGain();
    this.input = input;
    this.output = output;

    var mod1 = context.createBufferSource();
    var mod2 = context.createBufferSource();
    var mod3 = context.createBufferSource();
    var mod4 = context.createBufferSource();
    this.shiftDownBuffer = _pitchUtils.createDelayTimeBuffer(context, _pitchUtils.bufferTime, _pitchUtils.fadeTime, false);
    this.shiftUpBuffer = _pitchUtils.createDelayTimeBuffer(context, _pitchUtils.bufferTime, _pitchUtils.fadeTime, true);
    mod1.buffer = this.shiftDownBuffer;
    mod2.buffer = this.shiftDownBuffer;
    mod3.buffer = this.shiftUpBuffer;
    mod4.buffer = this.shiftUpBuffer;
    mod1.loop = true;
    mod2.loop = true;
    mod3.loop = true;
    mod4.loop = true;

    var mod1Gain = context.createGain();
    var mod2Gain = context.createGain();
    var mod3Gain = context.createGain();
    mod3Gain.gain.value = 0;
    var mod4Gain = context.createGain();
    mod4Gain.gain.value = 0;

    mod1.connect(mod1Gain);
    mod2.connect(mod2Gain);
    mod3.connect(mod3Gain);
    mod4.connect(mod4Gain);

    var modGain1 = context.createGain();
    var modGain2 = context.createGain();

    var delay1 = context.createDelay();
    var delay2 = context.createDelay();
    mod1Gain.connect(modGain1);
    mod2Gain.connect(modGain2);
    mod3Gain.connect(modGain1);
    mod4Gain.connect(modGain2);
    modGain1.connect(delay1.delayTime);
    modGain2.connect(delay2.delayTime);

    var fade1 = context.createBufferSource();
    var fade2 = context.createBufferSource();
    var fadeBuffer = _pitchUtils.createFadeBuffer(context, _pitchUtils.bufferTime, _pitchUtils.fadeTime);
    fade1.buffer = fadeBuffer;
    fade2.buffer = fadeBuffer;
    fade1.loop = true;
    fade2.loop = true;

    var mix1 = context.createGain();
    var mix2 = context.createGain();
    mix1.gain.value = 0;
    mix2.gain.value = 0;

    fade1.connect(mix1.gain);
    fade2.connect(mix2.gain);

    input.connect(delay1);
    input.connect(delay2);
    delay1.connect(mix1);
    delay2.connect(mix2);
    mix1.connect(output);
    mix2.connect(output);

    var t = context.currentTime + 0.050;
    var t2 = t + _pitchUtils.bufferTime - _pitchUtils.fadeTime;
    mod1.start(t);
    mod2.start(t2);
    mod3.start(t);
    mod4.start(t2);
    fade1.start(t);
    fade2.start(t2);

    this.mod1 = mod1;
    this.mod2 = mod2;
    this.mod1Gain = mod1Gain;
    this.mod2Gain = mod2Gain;
    this.mod3Gain = mod3Gain;
    this.mod4Gain = mod4Gain;
    this.modGain1 = modGain1;
    this.modGain2 = modGain2;
    this.fade1 = fade1;
    this.fade2 = fade2;
    this.mix1 = mix1;
    this.mix2 = mix2;
    this.delay1 = delay1;
    this.delay2 = delay2;

    this.setDelay(_pitchUtils.delayTime);
};

_pitchUtils.Jungle.prototype.setDelay = function(delayTime) {
    this.modGain1.gain.setTargetAtTime(0.5 * delayTime, 0, 0.010);
    this.modGain2.gain.setTargetAtTime(0.5 * delayTime, 0, 0.010);
};

_pitchUtils.Jungle.prototype.setPitchOffset = function(mult) {
  if (mult > 0) {
    this.mod1Gain.gain.value = 0;
    this.mod2Gain.gain.value = 0;
    this.mod3Gain.gain.value = 1;
    this.mod4Gain.gain.value = 1;
  } else {
    this.mod1Gain.gain.value = 1;
    this.mod2Gain.gain.value = 1;
    this.mod3Gain.gain.value = 0;
    this.mod4Gain.gain.value = 0;
  }
  this.setDelay(_pitchUtils.delayTime * Math.abs(mult));
};

// End Code from Google

// The following code is mostly from https://github.com/mmckegg/soundbank-pitch-shift
// and https://github.com/mmckegg/custom-audio-node/blob/master/index.js

_pitchUtils.createAudioParam = function(context, name, options) {
  options = options || {};

  var targets = options.targets;

  if (!targets && options.target) {
    targets = [options.target];
  } else if (!targets) {
    targets = [];
  }

  var param = Object.create(AudioParam.prototype, {
    value: {
      get: function() {
        return param._lastValue;
      },
      set: function(value) {
        value = param.fence(value);
        param._lastValue = value;
        for (var target in targets) {
          target.value = value;
        }
      }
    },
    defaultValue: {
      get: function() {
        return options.defaultValue;
      }
    },
    name: {
      value: name,
      writable: false
    },
    min: {
      value: options.min,
      writable: false
    },
    max: {
      value: options.max,
      writable: false
    }
  });

  param._targets = targets;
  param._lastValue = options.defaultValue;

  param.setValueAtTime = _pitchUtils.setValueAtTime;
  param.linearRampToValueAtTime = _pitchUtils.linearRampToValueAtTime;
  param.exponentialRampToValueAtTime = _pitchUtils.exponentialRampToValueAtTime;
  param.setTargetAtTime = _pitchUtils.setTargetAtTime;
  param.setValueCurveAtTime = _pitchUtils.setValueCurveAtTime;
  param.cancelScheduledValues = _pitchUtils.cancelScheduledValues;
  param.addTarget = _pitchUtils.addTarget;
  param.clearTargets = _pitchUtils.clearTargets;
  param.context = context;

  param.fence = _pitchUtils.fence;

  if (options.defaultValue) param.value = options.defaultValue;

  return param;
};

_pitchUtils.fence = function(value) {
  if (this.min) value = Math.max(this.min, value);

  if (this.max) value = Math.min(this.max, value);

  return value;
};

_pitchUtils.setValueAtTime = function(value, startTime) {
  var targets = this._targets;
  value = this.fence(value);

  this._lastValue = value;

  for (var target in targets) target.setValueAtTime(value, startTime);
};

_pitchUtils.setTargetAtTime = function(value, startTime, timeConstant) {
  var targets = this._targets;
  value = this.fence(value);
  for (var target in targets) if (target.setTargetAtTime) target.setTargetAtTime(value, startTime, timeConstant);
};

_pitchUtils.linearRampToValueAtTime = function(value, endTime) {
  var targets = this._targets;
  value = this.fence(value);

  this._lastValue = value;

  for (var target in targets) target.linearRampToValueAtTime(value, endTime);
};

_pitchUtils.exponentialRampToValueAtTime = function(value, endTime) {
  var targets = this._targets;
  value = this.fence(value);

  this._lastValue = value;

  for (var target in targets) target.exponentialRampToValueAtTime(value, endTime);
};

_pitchUtils.setValueCurveAtTime = function(curve, startTime, duration) {
  var targets = this._targets;
  this._lastValue = curve[curve.length - 1];

  for (var target in targets) target.setValueCurveAtTime(curve, startTime, duration);
};

_pitchUtils.cancelScheduledValues = function(startTime) {
  var targets = this._targets;
  for (var target in targets) target.cancelScheduledValues(startTime);
};

_pitchUtils.clearTargets = function() {
  this._targets = [];
};

_pitchUtils.addTarget = function(target) {
  this._targets.push(target);
  if (this._lastValue) target.value = this._lastValue;
};

_pitchUtils.createAudioNode = function(input, output, params, onDestinationChange) {
  var audioContext = (input || output).context;

  var node = audioContext.createGain();
  node._onDestinationChange = onDestinationChange;

  if (input) node.connect(input);

  node._output = output;
  node._targetCount = 0;

  if (output) {
    node.connect = _pitchUtils.connect;
    node.disconnect = _pitchUtils.disconnect;
  }

  _pitchUtils.addAudioParams(node, params);

  return node;
};

_pitchUtils.connect = function(destination, channel) {
  this._targetCount += 1;
  this._output.connect(destination, channel);
  if (typeof this._onDestinationChange === 'function') {
    this._onDestinationChange(this._targetCount);
  }
};

_pitchUtils.disconnect = function(param) {
  this._targetCount = 0;
  this._output.disconnect(param);
  if (typeof this._onDestinationChange === 'function') {
    this._onDestinationChange(this._targetCount);
  }
};

_pitchUtils.addAudioParams = function(node, params) {
  if (params) {
    var keys = Object.keys(params);
    for (var key in keys) {
      node[key] = _pitchUtils.createAudioParam(node.context, key, params[key]);
    }
  }
};

_pitchUtils.getMultiplier = function(x) {
  if (x < 0) {
    return x / 12;
  } else {
    var a5 = 1.8149080040913423e-7;
    var a4 = -0.000019413043101157434;
    var a3 = 0.0009795096626987743;
    var a2 = -0.014147877819596033;
    var a1 = 0.23005591195033048;
    var a0 = 0.02278153473118749;

    var x1 = x;
    var x2 = x * x;
    var x3 = x * x * x;
    var x4 = x * x * x * x;
    var x5 = x * x * x * x * x;

    return a0 + x1 * a1 + x2 * a2 + x3 * a3 + x4 * a4 + x5 * a5;
  }
};

var pitch = function(audioContext) {
  var instance = new _pitchUtils.Jungle(audioContext);
  var input = audioContext.createGain();
  var wet = audioContext.createGain();
  var dry = audioContext.createGain();
  var output = audioContext.createGain();

  dry.gain.value = 0;

  input.connect(wet);
  input.connect(dry);

  wet.connect(instance.input);
  instance.output.connect(output);

  dry.connect(output);

  var node = _pitchUtils.createAudioNode(input, output, {
    dry: {
      min: 0,
      defaultValue: 0,
      target: dry.gain
    },
    wet: {
      min: 0,
      defaultValue: 1,
      target: wet.gain
    }
  });

  instance.setPitchOffset(_pitchUtils.getMultiplier(12));

  var transpose = 0;
  Object.defineProperty(node, 'transpose', {
    set: function(value) {
      transpose = _pitchUtils.getMultiplier(value);
      instance.setPitchOffset(transpose);
    },
    get: function() {
      return transpose;
    }
  });
  return node;
};

