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
    dataNames: ["lesmis", "football", "jazz"],
    centralityNames: ["page", "random"],
    colorMapNames: ['single_blue', 'rainbow', 'divergent_red_blue', 'viridis'],
    spans: [0.20, 0.60],
};

// TODO: remove refpoint and choose random node in 3 nodes
// data(3) cent(2) color(4) span(2) => 48

const Data = new function () {
    this.dataset = {};
    const that = this;
    const allDataNames = ['dolphins', 'football', 'karate', 'lesmis', 'netscience', 'jazz'];
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
