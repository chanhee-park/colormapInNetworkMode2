let questions = [];
const t_questions = [
  ['karate', 'btw', 'single_oranges', 0.40],
  ['dolphins', 'deg_log', 'magma', 0.40],
  ['dolphins', 'deg_log', 'prtogn', 0.15],
];

const TEST_RESULT = [];

function Start () {
  changePage(0);
  $('#startColorBlind').click(function () {
    changePage(1);
    $('#completeColorblindTest').click(function () {
      blindTest();
      changePage(2);
      $('#startTutorial').click(function () {
        changePage(3);
        tutorialStart();
      });
    });
  });
}

// changePage(3);
// tutorialStart();

function changePage (pageNum) {
  $('html').scrollTop(0);
  $('body').html(Page[pageNum]);
}

function tutorialStart () {
  setTimeout(function () {
    tutorialTest(0);
  }, 1000);
}

function testStart () {
  questions = makeQuestionList();
  setTimeout(function () {
    userTest(0);
  }, 1000);
}

function tutorialTest (testIdx) {
  if (testIdx >= t_questions.length) {
    changePage(4);
    $('#startTest').click(function () {
      changePage(5);
      testStart(0);
    });
    return;
  }
  const q = t_questions[testIdx];
  drawGraph(q[0], q[1], q[2], q[3], testIdx, 'tutorial'); // data, cnet, color, span
}

function userTest (testIdx) {
  if (testIdx >= questions.length) {
    // End of Test (48)
    writeData();
    changePage(6);
    return TEST_RESULT;
  }
  let q = questions[testIdx];
  drawGraph(q[0], q[1], q[2], q[3], testIdx, 'actual'); // data, cnet, color, span
}


function getTargetSet (nodes, centrality, spanRatio) {
  const ret = [];
  const min = getMinValue(nodes, centrality);
  const max = getMaxValue(nodes, centrality);
  const spanDistance = getSpanDistance(min, max, spanRatio);
  const ct_distance = spanRatio > 0.2 ? 0.5 : 5.0;
  const len = nodes.length;
  for (let i = 0; i < len - 2; i++) {
    for (let j = i + 1; j < len - 1; j++) {
      const sourceMax = Math.max(nodes[i][centrality], nodes[j][centrality]);
      const sourceMin = Math.min(nodes[i][centrality], nodes[j][centrality]);
      const sourceDistance = sourceMax - sourceMin;
      for (let k = i + 2; k < len; k++) {
        const targetVal = nodes[k][centrality];
        if (sourceMin < targetVal && targetVal < sourceMax) {
          ret.push({
            nodes: [i, j, k],
            error: Math.abs(sourceDistance - spanDistance),
            distance:
              Math.max(sourceMax - targetVal, targetVal - sourceMin) *
              (1 + Math.random() / ct_distance)
          });
        }
      }
    }
  }
  const sorted = _.sortBy(ret, ['error', 'distance']);
  console.log(sorted);
  return sorted[0].nodes;
}

function getMinObj (objs, key) {
  return _.maxBy(objs, o => -Math.abs(o[key]));
}

function getMaxObj (objs, key) {
  return _.maxBy(objs, o => Math.abs(o[key]));
}

function getMinValue (objs, key) {
  const maxObj = getMinObj(objs, key);
  return maxObj[key];
}

function getMaxValue (objs, key) {
  const maxObj = getMaxObj(objs, key);
  return maxObj[key];
}

function getSpanDistance (min, max, span) {
  const interval = max - min;
  return span * interval;
}
function getSpanRatio (min, max, distance) {
  return (distance - min) / (max - min);
}

function makeQuestionList () {
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

function blindTest () {
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
  console.log(TEST_DATA);
}
