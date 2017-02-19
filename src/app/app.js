
import { metro, ms } from 'plonk';
import debounce from 'lodash/debounce';

import store from './store';
import SynthEngine from './synth-engine/synth-engine';
import VideoPlayer from './ui/video-player';

const app = {
  store,
  run () {
    // this.synthEngine = new SynthEngine()
    //   .on('error', (err) => {
    //     console.error(err);
    //   })
    //   .on('ready', () => {
    //     console.log('[ready] synth engine');
    //   })
    //   .run();

    // this.videoPlayer = new VideoPlayer({
    //   el: document.body.querySelector('#video-player')
    // });

    // this.store.run();
    // this.synthEngine.play();
    // this.videoPlayer.play();
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
