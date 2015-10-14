
var plonk = require('plonk');

var SynthEngine = require('app/synth-engine/synth-engine'),
    VideoReader = require('app/lib/video-reader'),
    VideoPlayer = require('app/ui/video-player');

var app = {};

app.run = function () {
    this.synthEngine = new SynthEngine()
        .on('error', function (err) { console.error(err); })
        .on('ready', function () { console.log('[ready] synth engine'); })
        .run();
    this.videoPlayer = new VideoPlayer({ el: document.body.querySelector('#video-player') });
    return this;
};

app.play = function () {
    this.synthEngine.play();
    this.videoPlayer.play();
    return this;
};

app.stop = function () {
    this.synthEngine.stop();
    return this;
};

window.addEventListener('load', function () {
    window.app = app.run();
    app.play();
});

window.addEventListener('resize', plonk.limit(150, function () {
    app.videoPlayer.resize();
}));

module.exports = app;
