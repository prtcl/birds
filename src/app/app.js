
import debounce from 'lodash/debounce';

import SynthEngine from 'app/synth-engine/synth-engine';
import ValueDuster from 'app/controllers/value-duster';
import VideoPlayer from 'app/ui/video-player';

const app = {
  run () {
    this.synthEngine = new SynthEngine()
      .on('error', (err) => {
        console.error(err);
      })
      .on('ready', () => {
        console.log('[ready] synth engine');
      })
      .run();

    this.videoPlayer = new VideoPlayer({
      el: document.body.querySelector('#video-player')
    });

    this.valueDuster = new ValueDuster()
      .on('audio-params', (attrs) => {
        this.synthEngine.setParameters(attrs);
      })
      .on('video-params', (attrs) => {
        this.videoPlayer.seek(attrs.video_position);
        this.videoPlayer.speed(attrs.video_speed);
        this.videoPlayer.opacity(attrs.video_opacity);
      });

    this.synthEngine.play();
    this.valueDuster.run();
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
