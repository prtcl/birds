
import {
  drunk,
  exp,
  scale,
  walk
} from 'plonk';

import EventEmitter from 'events';

export default class ValueDuster extends EventEmitter {
  constructor () {
    super();

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
      xmodA: drunk(10, 100, 0.05),
      xmodB: drunk(10, 100, 0.05),
      oscA_gain: drunk(0.75, 1, 0.05),
      oscB_gain: drunk(0.75, 1, 0.05),
      oscA_freq: drunk(5, 46),
      oscB_freq: drunk(5, 38),
      delay_time: drunk(0.01, 0.1, 0.075),
      filter_freq: drunk(100, 6000),
      video_position: drunk(0, 1, 0.077),
      video_speed: drunk(0, 2, 0.5),
      video_opacity: drunk(0.05, 0.2, 0.5)
    };

    this._running = false;
  }

  run () {
    if (this._running) return this;
    this._running = true;

    walk(20, 50, () => {
      this.attrs.xmodA = this._drunks.xmodA();
      this.emit('audio-params', this.attrs);
    });

    walk(20, 50, () => {
      this.attrs.xmodB = this._drunks.xmodB();
      this.emit('audio-params', this.attrs);
    });

    walk(20, 50, () => {
      this.attrs.oscA_gain = exp(this._drunks.oscA_gain());
      this.emit('audio-params', this.attrs);
    });

    walk(20, 50, () => {
      this.attrs.oscB_gain = exp(this._drunks.oscB_gain());
      this.emit('audio-params', this.attrs);
    });

    walk(50, 300, () => {
      this.attrs.oscA_freq = this._drunks.oscA_freq();
      this.emit('audio-params', this.attrs);
    });

    walk(50, 300, () => {
      this.attrs.oscB_freq = this._drunks.oscB_freq();
      this.emit('audio-params', this.attrs);
    });

    walk(1000, 10000, () => {
      var value = this._drunks.delay_time();
      this.attrs.delay_time = value;
      this.attrs.video_opacity = value;
      this.emit('audio-params', this.attrs);
    });

    walk(100, 300, () => {
      var value = this._drunks.filter_freq();
      this.attrs.filter_freq = value;
      this.attrs.video_position = scale(value, 100, 6000, 0, 1);
      this.emit('audio-params', this.attrs);
    });

    walk(100, 250, () => {
      this.attrs.video_position = this._drunks.video_position();
      this.attrs.video_speed = this._drunks.video_speed();
      this.attrs.video_opacity = this._drunks.video_opacity();
      this.emit('video-params', this.attrs);
    });

    return this;
  }
}
