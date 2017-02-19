
import { drunk, exp, scale, walk } from 'plonk';
import EventEmitter from 'events';

export const state = {
  isRunning: false,
  delay_time: 0,
  filter_freq: 0,
  oscA_freq: 0,
  oscA_gain: 0,
  oscB_freq: 0,
  oscB_gain: 0,
  video_opacity: 0,
  video_position: 0,
  xmodA: 0,
  xmodB: 0
};

export class Store extends EventEmitter {

  constructor () {
    super();

    this.state = state;
    this.drunks = {
      delay_time: drunk(0.01, 0.1, 0.075),
      filter_freq: drunk(100, 6000),
      oscA_freq: drunk(5, 46),
      oscA_gain: drunk(0.75, 1, 0.05),
      oscB_freq: drunk(5, 38),
      oscB_gain: drunk(0.75, 1, 0.05),
      video_opacity: drunk(0.05, 0.2, 0.5),
      video_position: drunk(0, 1, 0.077),
      video_speed: drunk(0, 2, 0.5),
      xmodA: drunk(10, 100, 0.05),
      xmodB: drunk(10, 100, 0.05)
    };

  }

  run () {
    if (this.state.isRunning) return this;
    this.state.isRunning = true;

    walk(20, 50, (interval, i, elapsed, stop) => {
      if (!this.state.isRunning) {
        return stop();
      }

      this.state.xmodA = this.drunks.xmodA();

      this.emit('update:audio-params', this.state);
    });

    walk(20, 50, (interval, i, elapsed, stop) => {
      if (!this.state.isRunning) {
        return stop();
      }

      this.state.xmodB = this.drunks.xmodB();

      this.emit('update:audio-params', this.state);
    });

    walk(20, 50, (interval, i, elapsed, stop) => {
      if (!this.state.isRunning) {
        return stop();
      }

      this.state.oscA_gain = exp(this.drunks.oscA_gain());

      this.emit('update:audio-params', this.state);
    });

    walk(20, 50, (interval, i, elapsed, stop) => {
      if (!this.state.isRunning) {
        return stop();
      }

      this.state.oscB_gain = exp(this.drunks.oscB_gain());

      this.emit('update:audio-params', this.state);
    });

    walk(50, 300, (interval, i, elapsed, stop) => {
      if (!this.state.isRunning) {
        return stop();
      }

      this.state.oscA_freq = this.drunks.oscA_freq();

      this.emit('update:audio-params', this.state);
    });

    walk(50, 300, (interval, i, elapsed, stop) => {
      if (!this.state.isRunning) {
        return stop();
      }

      this.state.oscB_freq = this.drunks.oscB_freq();

      this.emit('update:audio-params', this.state);
    });

    walk(1000, 10000, (interval, i, elapsed, stop) => {
      if (!this.state.isRunning) {
        return stop();
      }

      const value = this.drunks.delay_time();

      this.state.delay_time = value;
      this.state.video_opacity = value;

      this.emit('update:audio-params', this.state);
    });

    walk(100, 300, (interval, i, elapsed, stop) => {
      if (!this.state.isRunning) {
        return stop();
      }

      const value = this.drunks.filter_freq();

      this.state.filter_freq = value;
      this.state.video_position = scale(value, 100, 6000, 0, 1);

      this.emit('update:audio-params', this.state);
    });

    walk(100, 250, (interval, i, elapsed, stop) => {
      if (!this.state.isRunning) {
        return stop();
      }

      this.state.video_position = this.drunks.video_position();
      this.state.video_speed = this.drunks.video_speed();
      this.state.video_opacity = this.drunks.video_opacity();

      this.emit('update:video-params', this.state);
    });

    return this;
  }

  stop () {
    this.state.isRunning = false;
    return this;
  }

}

const store = new Store();

export default store;
