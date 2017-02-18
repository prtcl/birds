
export default function audioContext () {
  var context;
  if (typeof AudioContext !== 'undefined') {
    context = new AudioContext();
  } else if (typeof webkitAudioContext !== 'undefined') {
    context = new webkitAudioContext();
  }
  return context;
}
