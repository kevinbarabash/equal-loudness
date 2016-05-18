const dft = (x) => {
    const N = x.length;
    const X = [];

    for (let k = 0; k < N; k++) {
        let re = 0;
        let im = 0;

        for (let n = 0; n < N; n++) {
            const t = -2 * Math.PI * k * n / N;
            re += x[n] * Math.cos(t);
            im += x[n] * Math.sin(t);
        }

        X[k] = [1/N * re, 1/N * im];
    }

    return X;
};

const idft = (X) => {
    const N = X.length;
    const x = new Float32Array(N);

    for (let n = 0; n < N; n++) {
        let re = 0;
        let im = 0;

        for (let k = 0; k < N; k++) {
            const t = 2 * Math.PI * k * n / N;
            re += X[k][0] * Math.cos(t) - X[k][1] * Math.sin(t);
            im += X[k][0] * Math.sin(t) + X[k][1] * Math.cos(t);
        }

        // x[n] = Math.sqrt(re * re + im * im);
        x[n] = re;
    }

    return x;
};
