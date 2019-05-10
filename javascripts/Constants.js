const Constant = {
    that: this,
    // https://github.com/d3/d3-scale-chromatic
    colorMaps: {
        'single_blue': d3.interpolateBlues,
        'single_grey': d3.interpolateGreys,
        'inferno': d3.interpolateInferno,
        'divergent_red_blue': d3.interpolateRdYlBu,
        'viridis': d3.interpolateViridis,
        'brewer_yellow-green-blue': d3.interpolateYlGnBu,
        'rainbow': d3.interpolateRainbow,
        'magma': d3.interpolateMagma,
        'plasma': d3.interpolatePlasma,
        'single_greens': d3.interpolateGreens,
        'heat': d3.interpolateYlOrRd,
    },
};

const dataNames = ["lesmis", "football", "jazz"];
// const centralityNames = ["deg_log", "btw", "random"];
const centralityNames = ["btw", "random"];
const colorMapNames = ['single_blue', 'rainbow', 'divergent_red_blue', 'viridis'];
const spans = [0.15, 0.30, 0.60];
const referencePoint = [[0, 0.333], [0.333, 0.666], [0.666, 1]];
// data(3) cent(3) color(4) span(3) ref(3) => 324
// data(2) cent(2) color(4) span(3) 

const Data = new function () {
    this.dataset = {};
    const allDataNames = ['dolphins', 'football', 'karate', 'lesmis', 'netscience', 'jazz'];
    const that = this;

    this.road = async () => {
        for (let i = 0; i < allDataNames.length; i++) {
            that.dataset[allDataNames[i]] = await $.getJSON('./data/' + allDataNames[i] + '.json');
        }
    };

    this.getData = (dataName) => {
        return that.dataset[dataName];
    };

    return this;
};
Data.road();
