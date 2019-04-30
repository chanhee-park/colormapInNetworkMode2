const questions = makeQuestionList();
const TEST_RESULT = [];

function userTest(testIdx) {
    if (testIdx >= questions.length){
        console.log(TEST_RESULT);
        return TEST_RESULT;
    }
    const q = questions[testIdx];
    setTimeout(function () {
        drawGraph(q[0],q[1],q[2],q[3], testIdx); // data, cnet, color, span
    }, 1000);
}

setTimeout(function () {
    userTest(0);
}, 1000);

function getTargetSet(nodes, centrality, span) {
    const ret = [];
    const min = getMinValue(nodes, centrality);
    const max = getMaxValue(nodes, centrality);
    const distance = getDistance(min, max, span);
    const errRange = 0.01 * (max - min); // -1% ~ +1%
    const len = nodes.length;
    for (let i = 0; i < len - 2; i++) {
        for (let j = i + 1; j < len - 1; j++) {
            const sourceMin = Math.min(nodes[i][centrality], nodes[j][centrality]);
            const sourceMax = Math.max(nodes[i][centrality], nodes[j][centrality]);
            const sourceDistance = sourceMax - sourceMin;
            if (!isFloatInRange(distance, sourceDistance, errRange)) continue;
            for (let k = j; k < len; k++) {
                const targetVal = nodes[k][centrality];
                if (sourceMin < targetVal && targetVal < sourceMax) {
                    ret.push([i, j, k]);
                }
            }
        }
    }
    return ret;
}

function getMinObj(objs, key) {
    return _.maxBy(objs, (o) => -Math.abs(o[key]));
}

function getMaxObj(objs, key) {
    return _.maxBy(objs, (o) => Math.abs(o[key]));
}

function getMinValue(objs, key) {
    const maxObj = getMinObj(objs, key);
    return maxObj[key];
}

function getMaxValue(objs, key) {
    const maxObj = getMaxObj(objs, key);
    return maxObj[key];
}

function sortBy(objs, key) {
    return _.sortBy(objs, [function (o) {
        return o[key];
    }]);
}

function sortedIdxBy(objs, key) {
    let objsWithIndex = [];
    _.forEach((objs), (o, i) => objsWithIndex.push([o, i]));
    objsWithIndex.sort((left, right) => left[0][key] < right[0][key] ? -1 : 1);

    const indexes = [];
    _.forEach(objsWithIndex, (o) => indexes.push(o[1]));

    return indexes;
}

function getDistance(min, max, span) {
    const interval = max - min;
    return span * interval + min;
}

function isFloatInRange(source, target, errRange) {
    const distance = Math.abs(source - target);
    return distance < errRange;
}

function makeQuestionList() {
    const questions = [];
    _.forEach(dataNames, (data)=>{
        _.forEach(centralityNames, (cent)=>{
            _.forEach(colorMapNames, (color)=>{
                _.forEach(spans, (span)=>{
                    questions.push([data, cent, color, span]);
                })
            })
        })
    })
    return questions;
}
