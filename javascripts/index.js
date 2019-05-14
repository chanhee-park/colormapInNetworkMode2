const questions = makeQuestionList();
const TEST_RESULT = [];

function userTest(testIdx) {
    if (testIdx >= questions.length){
        console.log(TEST_RESULT);
        return TEST_RESULT;
    }
    const q = questions[testIdx];
    setTimeout(function () {
        drawGraph(q[0], q[1], q[2], q[3], testIdx); // data, cnet, color, span
    }, 1000);
}

setTimeout(function () {
    userTest(0);
}, 2000);


function getTargetSet(nodes, centrality, spanRatio) {
    const ret = [];
    const min = getMinValue(nodes, centrality);
    const max = getMaxValue(nodes, centrality);
    const spanDistance = getSpanDistance(min, max, spanRatio);
    const len = nodes.length;
    for (let i = 0; i < len - 2; i++) {
        for (let j = i + 1; j < len - 1; j++) {
            const sourceMin = Math.min(nodes[i][centrality], nodes[j][centrality]);
            const sourceMax = Math.max(nodes[i][centrality], nodes[j][centrality]);
            const sourceDistance = sourceMax - sourceMin;
            const k = Util.getRandomIntWithout([i, j], 0, len);
            const info = {
                nodes : [i, j, k],
                error: Math.abs(sourceDistance - spanDistance)
            }
            ret.push(info);
        }
    }
    const sorted = _.sortBy(ret, 'error');
    return sorted[0].nodes;
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

function getSpanDistance(min, max, span) {
    const interval = max - min;
    return span * interval + min;
}
function getSpanRatio(min, max, distance) {
    return (distance - min) / (max - min);
}

function makeQuestionList() {
    const questions = [];
    _.forEach(Constant.dataNames, data => {
    _.forEach(Constant.centralityNames, cent => { 
    _.forEach(Constant.colorMapNames, color => {
    _.forEach(Constant.spans, span => {
        questions.push([data, cent, color, span]);
    })})})});
    return Util.shuffle(questions);
}

// TODO: 실험 소개 페이지 만들기
// TODO: 페이지 접속시, 로그인 페이지 팝업
// TODO: 색맹 이미지 변경
// TODO: 튜토리얼은 안쓰인 데이터와 컬러맵으로
// TODO: 데이터 저장 (항목 많이 ~~~ )