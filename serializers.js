var saveSample = function (sample) {
    return {
        url: sample.audio.src,
        volume: sample.audio.volume
    };
}

var loadSample = function (obj) {
    return new Sample(obj.url, obj.volume);
}


var saveChannel = function (name, channel) {
    return {
        name: name,
        sample: saveSample(channel.sample),
        bars: channel.bars
    };
}

var loadChannel = function (obj) {
    var channel = new Channel(loadSample(obj.sample));
    channel.load(obj.bars);
    channel.name = obj.name;
    return channel;
}


var SongSaver = function (song) {
    this.song = song;
}
SongSaver.prototype.getChannels = function () {
    var channels = [];
    for (ch in this.song.channels) {
        channels.push(saveChannel(ch, this.song.channels[ch]));
    }
    return channels;
}
SongSaver.prototype.save = function () {
    return {
        channels: this.getChannels(),
        bpm: this.song.bpm,
    };
}

var saveSong = function (song) {
    return new SongSaver(song).save();
}


var SongLoader = function (obj) {
    this.obj = obj;
}
SongLoader.prototype.loadChannels = function () {
    var channels = this.obj.channels;
    for (ch in channels) {
        var channel = loadChannel(channels[ch])
        this.song.addChannel(channel.name, channel);
        this.song.loadChannel(channel.name, channel.bars);
    }
}
SongLoader.prototype.load = function () {
    this.song = new Song();
    this.song.setBPM(this.obj.bpm);
    this.loadChannels();
    return this.song;
}

var loadSong = function(obj) {
    return new SongLoader(obj).load();
}
