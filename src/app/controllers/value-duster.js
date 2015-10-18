
var _ = {
    bind: require('lodash/function/bind'),
    create: require('lodash/object/create')
};

var plonk = require('plonk');

var EventEmitter = require('events');

function ValueDuster () {
    this.attrs = {
        xmodA: 0,
        xmodB: 0,
        oscA_gain: 0,
        oscB_gain: 0,
        oscA_freq: 0,
        oscB_freq: 0,
        delay_time: 0,
        filter_freq: 0,
        video_position: 0,
        video_opacity: 0
    };
    this._drunks = {
        xmodA: plonk.drunk(10, 100, 0.05),
        xmodB: plonk.drunk(10, 100, 0.05),
        oscA_gain: plonk.drunk(0.75, 1, 0.05),
        oscB_gain: plonk.drunk(0.75, 1, 0.05),
        oscA_freq: plonk.drunk(5, 46),
        oscB_freq: plonk.drunk(5, 38),
        delay_time: plonk.drunk(0.01, 0.1, 0.075),
        filter_freq: plonk.drunk(100, 6000),
        video_position: plonk.drunk(0, 1, 0.077),
        video_speed: plonk.drunk(0, 2, 0.5),
        video_opacity: plonk.drunk(0.05, 0.2, 0.5)
    }
    this._running = false;
}

ValueDuster.prototype = _.create(EventEmitter.prototype, ValueDuster.prototype);

ValueDuster.prototype.run = function () {
    if (this._running) return this;
    this._running = true;
    plonk.walk(20, 50, function () {
        if (!this._running) return false;
        this.attrs.xmodA = this._drunks.xmodA();
        this.emit('audio-params', this.attrs);
    }, this);
    plonk.walk(20, 50, function () {
        if (!this._running) return false;
        this.attrs.xmodB = this._drunks.xmodB();
        this.emit('audio-params', this.attrs);
    }, this);
    plonk.walk(20, 50, function () {
        if (!this._running) return false;
        this.attrs.oscA_gain = plonk.log(this._drunks.oscA_gain());
        this.emit('audio-params', this.attrs);
    }, this);
    plonk.walk(20, 50, function () {
        if (!this._running) return false;
        this.attrs.oscB_gain = plonk.log(this._drunks.oscB_gain());
        this.emit('audio-params', this.attrs);
    }, this);
    plonk.walk(50, 300, function () {
        if (!this._running) return false;
        this.attrs.oscA_freq = this._drunks.oscA_freq();
        this.emit('audio-params', this.attrs);
    }, this);
    plonk.walk(50, 300, function () {
        if (!this._running) return false;
        this.attrs.oscB_freq = this._drunks.oscB_freq();
        this.emit('audio-params', this.attrs);
    }, this);
    plonk.walk(1000, 10000, function () {
        if (!this._running) return false;
        var value = this._drunks.delay_time();
        this.attrs.delay_time = value;
        this.attrs.video_opacity = value;
        this.emit('audio-params', this.attrs);
    }, this);
    plonk.walk(100, 300, function () {
        if (!this._running) return false;
        var value = this._drunks.filter_freq();
        this.attrs.filter_freq = value;
        this.attrs.video_position = plonk.scale(value, 100, 6000, 0, 1);
        this.emit('audio-params', this.attrs);
    }, this);
    plonk.walk(100, 250, function () {
        plonk.tick(function () {
            this.attrs.video_position = this._drunks.video_position();
            this.attrs.video_speed = this._drunks.video_speed();
            this.attrs.video_opacity = this._drunks.video_opacity();
            this.emit('video-params', this.attrs);
        }, this);
    }, this);
    return this;
};

ValueDuster.prototype.stop = function () {
    this._running = false;
    return this;
};

module.exports = ValueDuster;
