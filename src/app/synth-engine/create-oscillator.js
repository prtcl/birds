
var _ = { assign: require('lodash/object/assign') };

module.exports = function (args, audioContext) {
    args || (args = {});
    var options = _.assign({ type: 'sine', frequency: 440 }, args),
        osc = audioContext.createOscillator();
    osc.type = options.type;
    osc.frequency.value = options.frequency;
    osc.start(0);
    return osc;
};
