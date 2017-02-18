
import EventEmitter from 'events';
import plonk from 'plonk';


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
    this.emit('load');
  }

  _progressHandler () {
    this.duration = this.video.buffered.end(0);
  }

  _frameHandler () {
    if (!this.playing) return false;

    this.time = this.video.currentTime;
    this.position = (this.time / this.duration);
    this.width = this.el.clientWidth;
    this.height = this.el.clientHeight;

    this.context.drawImage(this.video, 0, 0, this.width, this.height);
    this.emit('frame', this.video, this.position);

    return this.playing;
  }

  resize () {
    this.width = this.canvas.width = this.el.clientWidth;
    this.height = this.canvas.height = this.el.clientHeight;
    return this;
  }

  play () {
    this.playing = true;
    this.video.play();
    plonk.frames(this._frameHandler, this);
    return this;
  }

  stop () {
    this.playing = false;
    this.video.pause();
    this.position = this.time = this.video.currentTime = 0;
    return this;
  }

  seek (n) {
    n = plonk.constrain(n || 0, 0, 1);
    this.position = this.video.currentTime = Math.round(n * this.duration);
    return this;
  }

  speed (n) {
    n = plonk.constrain(n || 0, 0, 10);
    this.video.playbackRate = n;
    return this;
  }

  opacity (n) {
    n = plonk.constrain(n || 0, 0, 1);
    this.context.globalAlpha = n;
    return this;
  }
}
