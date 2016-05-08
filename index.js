// source: http://stackoverflow.com/questions/22604500/web-audio-api-working-with-decibels
// decibel_level = 10 * log10( gain.value );
// gain.value = Math.pow(10, (decibel_level/10));

const canvas = document.createElement('canvas');
canvas.width = 1024;
canvas.height = 768;
canvas.style.border = 'solid 1px gray';
document.body.appendChild(canvas);

const context = canvas.getContext('2d');
context.fillStyle = 'red';

const log10 = (x) => Math.log(x) / Math.log(10);
const scale = 100;

const audioCtx = new AudioContext();

// duration in seconds
const playSound = (freq, multiplier) => {
    const duration = 1;
    // create Oscillator node
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

    gainNode.gain.value = 0.1 * multiplier;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = freq; // value in hertz
    oscillator.start();

    oscillator.stop(audioCtx.currentTime + duration);
};

const graphCurve = (data) => {
    const [ , ...freqs] = data.x;
    const [ , ...loudness] = data.y;

    // freqs.forEach((freq, index) => {
    //     var x = Math.log(freq) * scale - scale;
    //     var y = 768 - 5 * loudness[index] - 70;
    //
    //     console.log(freq);
    //     context.beginPath();
    //     context.arc(x, y, 3, 0, 2 * Math.PI, false);
    //     context.fill();
    // });

    context.beginPath();
    context.strokeStyle = 'red';
    freqs.forEach((freq, index) => {
        var x = Math.log(freq) * scale - scale;
        var y = 768 - 5 * loudness[index] - 70;

        if (index === 0) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }
    });
    context.stroke();
};

const graph = (json) => {
    var i = 1;
    var inc = 1;

    while (i <= 20000) {
        var x = Math.log(i) * scale - scale;

        context.strokeStyle = Number.isInteger(log10(i))
            ? 'gray'
            : 'lightgray';

        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, 768);
        context.stroke();

        i += inc;

        var iDigits = i.toString().length;
        var incDigits = inc.toString().length;
        if (iDigits > incDigits) {
            inc *= 10;
        }
    }

    graphCurve(json.data[0]);
    graphCurve(json.data[1]);
    graphCurve(json.data[2]);
    graphCurve(json.data[3]);
    graphCurve(json.data[4]);
    graphCurve(json.data[5]);
    graphCurve(json.data[6]);

    const curve = 0;
    const data = json.data[curve];

    const [ , ...freqs] = data.x;
    const [ , ...loudness] = data.y;

    // Convert delta loudness to dB
    // http://www.sengpielaudio.com/calculator-soundlevel.htm
    const base_db = (20 * curve);
    const pairs = loudness.map((db, i) => [freqs[i], Math.pow(2, (db - base_db) / 10)]);
    console.log(pairs);

    // less than 400 starts to sound quieter than 1000
    // less than 100 starts to sound pretty quiet
    // less than 40 is almost in audible except for clicks where the speaker cuts out
    // It's quite possible that the reason why these low frequencies are so quiet
    // is that the ear buds are just really bad at pushing frequencies that low.
    for (const [id, multiplier] of pairs) {
        const button = document.getElementById(id);
        button.addEventListener('click', () => playSound(id, multiplier));
    }
};

fetch('equal-loudness-contours.json')
    .then(res => res.json())
    .then(json => {
        console.log(json);
        graph(json);
    });