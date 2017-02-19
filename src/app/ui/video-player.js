
import { clamp, frames } from 'plonk';
import EventEmitter from 'events';

export default class VideoPlayer extends EventEmitter {

  constructor (args = {}) {
    super();

    this.duration = 0;
    this.time = 0;
    this.position = 0;
    this.el = args.el;

    this.video = this.el.querySelector('video');
    this.video.loop = true;
    this.video.preload = 'auto';

    this.video.addEventListener('canplay', () => {
      this._canplayHandler();
    });
    this.video.addEventListener('progress', () => {
      this._progressHandler();
    });

    this.canvas = this.el.querySelector('canvas');
    this.context = this.canvas.getContext('2d');

    this.resize();
  }

  _canplayHandler () {
    this._progressHandler();
    this.emit('loaded');
  }

  _progressHandler () {
    this.duration = this.video.buffered.end(0);
  }

  _frameHandler (interval, i, elapsed, stop) {
    if (!this.isPlaying) {
      return stop();
    }

    this.time = this.video.currentTime;
    this.position = (this.time / this.duration);
    this.width = this.el.clientWidth;
    this.height = this.el.clientHeight;

    this.context.drawImage(this.video, 0, 0, this.width, this.height);

    this.emit('frame', this.video, this.position);
  }

  resize () {
    this.width = this.canvas.width = this.el.clientWidth;
    this.height = this.canvas.height = this.el.clientHeight;
    return this;
  }

  play () {
    if (this.isPlaying) return this;

    this.isPlaying = true;
    this.video.play();

    frames((...args) => {
      this._frameHandler(...args);
    });

    return this;
  }

  stop () {
    if (!this.isPlaying) return this;

    this.isPlaying = false;
    this.video.pause();
    this.position = this.time = this.video.currentTime = 0;

    return this;
  }

  seek (n) {
    n = clamp(n || 0, 0, 1);
    this.position = this.video.currentTime = Math.round(n * this.duration);

    return this;
  }

  speed (n) {
    n = clamp(n || 0, 0, 10);
    this.video.playbackRate = n;

    return this;
  }

  opacity (n) {
    n = clamp(n || 0, 0, 1);
    this.context.globalAlpha = n;

    return this;
  }
}
