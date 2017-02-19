
import debounce from 'lodash/debounce';

import store from './store';
import SynthEngine from './synth-engine/synth-engine';
import VideoPlayer from './ui/video-player';

const app = {
  store,
  run () {
    this.synthEngine = new SynthEngine()
      .on('error', (err) => {
        console.error(err);
      })
      .on('ready', () => {
        console.log('[ready] synth engine');
      });

    this.videoPlayer = new VideoPlayer({
      el: document.body.querySelector('#video-player')
    });

    this.store
      .on('update:audio-params', (attrs) => {
        this.synthEngine.setParameters(attrs);
      })
      .on('update:video-params', (attrs) => {
        this.videoPlayer.seek(attrs.video_position);
        this.videoPlayer.speed(attrs.video_speed);
        this.videoPlayer.opacity(attrs.video_opacity);
      });

    this.store.run();
    this.synthEngine.run();
    this.synthEngine.play();
    this.videoPlayer.play();
    return this;
  }
};

export default app;

window.addEventListener('load', () => {
  window.app = app.run();
});

window.addEventListener('resize', debounce(() => {
  app.videoPlayer.resize();
}, 150));
