var mixer = function() {
    var _ctx = new (window.AudioContext || window.webkitAudioContext)();
    _ctx.player1 = player(_ctx);
    _ctx.player2 = player(_ctx);
    _ctx.crossfader = crossfader(_ctx, _ctx.player1.audio, _ctx.player2.audio);

    _ctx.crossfader.audio.connect(_ctx.destination);

    return _ctx;
};
