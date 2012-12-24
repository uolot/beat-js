var Sample = function (url, volume) {
    var audio = new Audio(url);
    audio.load();
    audio.volume = volume || 1.0;
    this.audio = audio;
}

Sample.prototype.play = function () {
    this.rewind();
    this.audio.play();
};
Sample.prototype.rewind = function () {
    this.audio.currentTime = 0;
}
Sample.prototype.stop = function () {
    this.audio.pause();
    this.audio.currentTime = 0;
};



var Channel = function (sample) {
    this.sample = sample;
};
Channel.prototype.getBar = function(i) {
    return Boolean(this.bars[i]);
};
Channel.prototype.setBar = function(i, v) {
    this.bars[i] = Number(Boolean(v));
};
Channel.prototype.toggleBar = function (i) {
    this.setBar(i, !this.getBar(i));
};
Channel.prototype.load = function(bars) {
    this.bars = bars;
};
Channel.prototype.playBar = function(i) {
    if (this.getBar(i))
        this.sample.play();
};
Channel.prototype.setLength = function (l) {
    this.bars = new Array(l);
    for (i = 0; i < this.bars.length; i++)
        this.bars[i] = 0;
}



var Song = function () {
    this.channels = {};
    this.timerId = undefined;
    this.currentBar = 0;
    this.delay = 250;
    this.length = 16;
    this.setBPM(120);
};

Song.prototype.addChannel = function (name, channel) {
    this.channels[name] = channel;
    channel.setLength(this.length);
};
Song.prototype.loadChannel = function (name, bars) {
    this.channels[name].load(bars);
};

Song.prototype.play = function () {
    var self = this;

    this.timerId = setInterval(function() {
        updateView(self);
        var delay = 5;
        for (ch in self.channels) {
            setTimeout( function (ch, bar) {
                self.channels[ch].playBar(bar)
            }, delay, ch, self.currentBar);
            delay += 10;
        }
        self.currentBar = ++self.currentBar % self.length;
    }, self.delay)
};
Song.prototype.stop = function () {
    this.pause();
    this.currentBar = 0;
};
Song.prototype.pause = function () {
    clearInterval(this.timerId);
};
Song.prototype.setBPM = function (bpm) {
    this.bpm = bpm;
    this.delay = 15000.0 / bpm;
};
Song.prototype.setLength = function (l) {
    for (ch in this.channels) {
        this.channels[ch].setLength(l);
    }
    this.length = l;
};



