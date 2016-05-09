const audioCtx = new AudioContext();

const biquadFilter = audioCtx.createBiquadFilter();

biquadFilter.type = "bandpass";
biquadFilter.frequency.value = 1000;
biquadFilter.gain.value = 5;
biquadFilter.Q.value = 5;

const freqs = [
    20,
    25,
    31,
    40,
    50,
    63,
    80,
    100,
    125,
    160,
    200,
    250,
    315,
    400,
    500,
    630,
    800,
    1000,
    1250,
    1600,
    2000,
    2500,
    3150,
    4000,
    5000,
    6300,
    8000,
    10000,
    12500,
    16000,
    20000,
];

const myFrequencyArray = new Float32Array(freqs);

const magResponseOutput = new Float32Array(myFrequencyArray.length);
const phaseResponseOutput = new Float32Array(myFrequencyArray.length);

biquadFilter.getFrequencyResponse(myFrequencyArray, magResponseOutput, phaseResponseOutput);

const dbResponse = (res) => 20.0 * Math.log(res) / Math.LN10;

console.log(magResponseOutput.map(dbResponse));
console.log(phaseResponseOutput);

const canvas = document.createElement('canvas');
canvas.width = 1024;
canvas.height = 768;
document.body.appendChild(canvas);

const context = canvas.getContext('2d');
const scale = 100;

context.strokeStyle = 'black';
context.lineWidth = 1;
context.beginPath();
context.moveTo(0, 768 / 2);
context.lineTo(1024, 768 / 2);
context.stroke();

const graphCurve = (freqs, response) => {
    context.beginPath();

    context.strokeStyle = 'red';
    context.lineWidth = 2;

    freqs.forEach((freq, index) => {
        var x = Math.log(freq) * scale - scale;
        var y = 768 / 2 - 5 * response[index];

        if (index === 0) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }
    });
    context.stroke();
};

graphCurve(freqs, magResponseOutput.map(dbResponse));
