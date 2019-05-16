let questions = [];
const t_questions = [
  ['karate', 'btw', 'brewer_yellow-green-blue', 0.2],
  ['karate', 'deg_log', 'magma', 0.6],
  ['dolphins', 'deg_log', 'heat', 0.6]
];
const TEST_RESULT = [];

function Start() {
  $('.login-zone').remove();
  $('html').scrollTop(0);
  $('body').html(Page[0]);
  $('#startColorBlind').click(function() {
    $('html').scrollTop(0);
    $('body').html(Page[1]);
    $('#startTutorial').click(function() {
      blindTest();
    });
  });
}

function testStart() {
  questions = makeQuestionList();
  setTimeout(function() {
    userTest(-3);
  }, 1000);
}

function userTest(testIdx) {
  if (testIdx >= questions.length) {
    // End of Test (48)
    writeData();
    $('body').html(Page[3]);
    return TEST_RESULT;
  }

  // tutorial ? Tutorial (-3 ~ -1) : Actual Test (0 ~ 47)
  let q = testIdx < 0 ? t_questions[-testIdx - 1] : questions[testIdx];
  let setTime = testIdx < 1 ? 1500 : 100;
  setTimeout(function() {
    drawGraph(q[0], q[1], q[2], q[3], testIdx); // data, cnet, color, span
  }, setTime);
}

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
      for (let k = i + 2; k < len; k++) {
        const targetVal = nodes[k][centrality];
        if (sourceMin < targetVal && targetVal < sourceMax) {
          ret.push({
            nodes: [i, j, k],
            error:
              Math.abs(sourceDistance - spanDistance) + Math.random() / 10000
          });
        }
      }
    }
  }
  const sorted = _.sortBy(ret, 'error');
  console.log(sorted);
  return sorted[0].nodes;
}

function getMinObj(objs, key) {
  return _.maxBy(objs, o => -Math.abs(o[key]));
}

function getMaxObj(objs, key) {
  return _.maxBy(objs, o => Math.abs(o[key]));
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
        });
      });
    });
  });
  return Util.shuffle(questions);
}

function blindTest() {
  console.log('Blind Test');
  const correctVals = [12, 8, 16, 5, 3, 45];
  let color_blind = false;

  for (let i = 1; i <= 6; i++) {
    const val = parseInt($('#blind_test_' + i).val());
    const correct_val = correctVals[i - 1];
    if (val === undefined || val === '' || isNaN(val)) {
      alert('Please enter a number in every input window.');
      return;
    }
    color_blind = val === correct_val ? color_blind : true;
  }
  const addedText = color_blind ? '' : 'NOT ';
  TEST_DATA.u_colorblind = color_blind;
  console.log('color blind', color_blind);
  $('html').scrollTop(0);
  $('body').html(Page[2]);
  testStart(-3);
  console.log(TEST_DATA);
}
