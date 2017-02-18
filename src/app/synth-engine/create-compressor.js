
import assign from 'lodash/assign';

export default function createCompressor (args = {}, audioContext) {
  const options = assign({ ratio: 1.5, threshold: -1, attack: 0.1, release: 0.25 }, args),
        comp = audioContext.createDynamicsCompressor();
  comp.threshold.value = options.threshold;
  comp.ratio.value = options.ratio;
  comp.attack.value = options.attack;
  comp.release.value = options.release;
  return comp;
}
