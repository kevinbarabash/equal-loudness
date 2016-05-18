const canvas = document.createElement('canvas');
canvas.width = 1024;
canvas.height = 768;
canvas.style.border = 'solid 1px gray';

document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

const amp = 100;
const offset = 128;

// create a time-domain impulse
const array = new Float32Array(1024);

array[0] = 1;
array[1] = 0.5;
array[2] = 0.7;
array[3] = 0.2;
array[4] = 0.3;

// draw time-domain signal
ctx.beginPath();
ctx.moveTo(0, offset + amp * array[0]);
for (let i = 1; i < 1024; i += 1) {
    ctx.lineTo(i, offset + amp * array[i]);
}
ctx.stroke();

// calculate the frequency response by computing the dft
const result = dft(array);

// output is symmetric so we only graph the first half
for (let i = 0; i < 512; i++) {
    const re = result[i][0];
    const im = result[i][1];
    const len = Math.sqrt(re * re + im * im);
    ctx.beginPath();
    ctx.moveTo(i, 256);
    ctx.lineTo(i, 256 + 512 * 100 * len);
    ctx.stroke();
}

// draw 100% line
ctx.beginPath();
ctx.moveTo(0, 256 + 100);
ctx.lineTo(512, 256 + 100);
ctx.stroke();


// compute the inverse dft
const iarray = idft(result);

console.log(array.subarray(0, 10));
console.log(iarray.subarray(0, 10));
