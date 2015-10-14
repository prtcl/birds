
var SynthEngine = require('app/synth-engine/synth-engine');

var app = {};

app.run = function () {
    this.synthEngine = new SynthEngine()
        .on('error', function (err) { console.error(err); })
        .on('ready', function () { console.log('[ready] synth engine'); })
        .run();
    return this;
};

app.play = function () {
    this.synthEngine.play();
    return this;
};

app.stop = function () {
    this.synthEngine.stop();
    return this;
};

window.addEventListener('load', function () {
    window.app = app.run();
});

module.exports = app;
