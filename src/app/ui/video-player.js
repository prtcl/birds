
var _ = {
    bind: require('lodash/function/bind'),
    create: require('lodash/object/create')
};

var plonk = require('plonk');

var EventEmitter = require('events');

function VideoPlayer (args) {
    args || (args = {});
    this.duration = 0;
    this.time = 0;
    this.position = 0;
    this.el = args.el;
    this.video = this.el.querySelector('video');
    this.video.loop = true;
    this.video.preload = 'auto';
    this.video.addEventListener('canplay', _.bind(this._canplayHandler, this));
    this.video.addEventListener('progress', _.bind(this._progressHandler, this));
    this.canvas = this.el.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    this.resize();
}

VideoPlayer.prototype = _.create(EventEmitter.prototype, VideoPlayer.prototype);

VideoPlayer.prototype._canplayHandler = function () {
    this._progressHandler();
    this.emit('load');
};

VideoPlayer.prototype._progressHandler = function () {
    this.duration = this.video.buffered.end(0);
};

VideoPlayer.prototype._frameHandler = function () {
    if (!this.playing) return false;
    var time = this.time = this.video.currentTime,
        position = this.position = (this.time / this.duration),
        width = this.width = this.el.clientWidth,
        height = this.height = this.el.clientHeight;
    this.context.drawImage(this.video, 0, 0, width, height);
    this.emit('frame', this.video, position);
    return this.playing;
};

VideoPlayer.prototype.resize = function () {
    this.width = this.canvas.width = this.el.clientWidth;
    this.height = this.canvas.height = this.el.clientHeight;
    return this;
};

VideoPlayer.prototype.play = function () {
    this.playing = true;
    this.video.play();
    plonk.frames(this._frameHandler, this);
    return this;
};

VideoPlayer.prototype.stop = function () {
    this.playing = false;
    this.video.pause();
    this.position = this.time = this.video.currentTime = 0;
    return this;
};

VideoPlayer.prototype.seek = function (n) {
    n = plonk.constrain(n || 0, 0, 1);
    this.position = this.video.currentTime = Math.round(n * this.duration);
    return this;
};

VideoPlayer.prototype.speed = function (n) {
    n = plonk.constrain(n || 0, 0, 10);
    this.video.playbackRate = n;
    return this;
};

VideoPlayer.prototype.opacity = function (n) {
    n = plonk.constrain(n || 0, 0, 1);
    this.context.globalAlpha = n;
    return this;
};

module.exports = VideoPlayer;
