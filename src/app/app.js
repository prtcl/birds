
var plonk = require('plonk');

var SynthEngine = require('app/synth-engine/synth-engine'),
    ValueDuster = require('app/controllers/value-duster'),
    VideoPlayer = require('app/ui/video-player');

var app = {};

app.run = function () {
    this.synthEngine = new SynthEngine()
        .on('error', function (err) { console.error(err); })
        .on('ready', function () { console.log('[ready] synth engine'); })
        .run();
    this.videoPlayer = new VideoPlayer({ el: document.body.querySelector('#video-player') });
    this.valueDuster = new ValueDuster()
        .on('audio-params', function (attrs) {
            app.synthEngine.setParameters(attrs);
        })
        .on('video-params', function (attrs) {
            app.videoPlayer.seek(attrs.video_position);
            app.videoPlayer.speed(attrs.video_speed);
            app.videoPlayer.opacity(attrs.video_opacity);
        });
    return this;
};

app.play = function () {
    this.synthEngine.play();
    this.valueDuster.run();
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
