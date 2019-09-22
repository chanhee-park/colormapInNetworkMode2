main();

console.warn(
  "인스턴스 수가 매우 적은 경우, 부트스트랩을 해도 상자그림을 그릴 만한 통계치가 나오지 않는다." +
  "이에 따라, 값을 -1% ~ +1% 범위에서 랜덤하게 변형 후 그리기를 수행한다." +
  "이러한 랜덤 변형은 팀내 논의를 위한 것으로, 추후 변경이 필요하다.\n\n" +
  "또한, 이상치의 제거를 위해 한 테스크에 30초 이상 걸린 경우 필터링하였다."
);


async function main () {
  const svg = d3.select('svg#plots');

  const datanames = ['lesmis', 'football', 'jazz'];
  const centralities = ['random'];
  const colormaps = ['blue', 'RdYlBu', 'jet', 'viridis'];
  const spans = [0.15, 0.40];

  const dataset = await getDataset();
  const conditions = getConditionList(datanames, centralities, colormaps, spans);

  _.forEach(conditions, (condition, c_idx) => {
    const filltered = getConditioned(dataset, condition, 'nodeValue', 'time');
    const bootstraped = bootstrap(filltered, 100);
    for (let r_idx = 0; r_idx < 3; r_idx++) {
      const numberOfGroup = r_idx * 2 + 3; // 3, 5, 7, ...
      const splited = getSplited(bootstraped, numberOfGroup);
      draw(svg, c_idx, r_idx, condition, filltered, splited);
    }
  });
}

function getSplited (items, numOfGroup) {
  const splited = [];
  for (let i = 0; i < numOfGroup; i++) {
    splited.push([]);
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const value = item[0] < 0 ? 0 : item[0];
    const time = item[1] * (Math.random() * (1.010 - 0.990) + 0.990).toFixed(4);
    const groupIdx = Math.floor((value * 0.999) / (1 / numOfGroup));
    splited[groupIdx].push(time)
  }
  return splited;
}

function draw (svg, c_idx, r_idx, condition, instances, splited) {
  const w = 250;
  const h = 100;
  const margin = 100;
  const x_margin = r_idx * (w + margin);
  svg.append('line').attrs({
    x1: x_margin + margin,
    x2: x_margin + margin + w,
    y1: c_idx * (h + margin) + h,
    y2: c_idx * (h + margin) + h,
    stroke: '#555'
  });
  svg.append('line').attrs({
    x1: x_margin + margin,
    x2: x_margin + margin,
    y1: c_idx * (h + margin),
    y2: c_idx * (h + margin) + h,
    stroke: '#555'
  });
  svg.append('line').attrs({
    x1: x_margin + 0,
    x2: x_margin + margin + w * 2,
    y1: c_idx * (h + margin) + h + margin * 3 / 4,
    y2: c_idx * (h + margin) + h + margin * 3 / 4,
    stroke: '#aaa'
  });
  svg.append('text').text(`${condition[0].value},  ${condition[1].value},  ${condition[2].value},  ${condition[3].value}`).attrs({
    x: x_margin + margin,
    y: c_idx * (h + margin) + h + margin / 2,
  });
  svg.append('text').text('value').attrs({
    x: x_margin + margin + w - 20,
    y: c_idx * (h + margin) + h + 40,
  });
  svg.append('text').text('time').attrs({
    x: x_margin + margin - 60,
    y: c_idx * (h + margin) + 15,
  });

  const time = [0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30];
  const value = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, '', ''];
  const zero_x = margin;
  const zero_y = c_idx * (h + margin) + h;
  const valueR = 250;
  const timeR = 3;

  for (let i = 0; i <= 12; i += 2) {
    let x = zero_x + value[i] * valueR + x_margin;
    let y = zero_y - time[i] * timeR;
    svg.append('text').text(value[i]).attrs({
      x: x,
      y: zero_y + 20,
    });
    svg.append('text').text(time[i]).attrs({
      x: x_margin + zero_x - 20,
      y: y,
    });
  }

  for (let i = 0; i <= 1; i += 0.01) {
    let x = zero_x + i * valueR + x_margin;
    let colormapName = condition[2].value;
    colormapName = colormapName === 'jet' ? 'matlabJet' : colormapName;
    svg.append('rect').attrs({
      x: x,
      y: zero_y,
      width: 3,
      height: 5,
      fill: Constant.colorMaps[colormapName](i),
    });
  }

  for (let i = 0; i < instances.length; i++) {
    let x = zero_x + instances[i][0] * valueR + x_margin;
    let y = zero_y - instances[i][1] * timeR;
    svg.append('circle').attrs({
      cx: x,
      cy: y,
      r: 3,
      fill: '#052',
      opacity: 0.2
    });
  }
  for (let i = 0; i < splited.length; i++) {
    const group = splited[i];
    const boxInfo = getBox(group);
    let x = zero_x + (i / splited.length) * valueR + (0.5 / splited.length) * valueR + x_margin;
    let y = zero_y - boxInfo.q1 * timeR;
    let h = y - (zero_y - boxInfo.q3 * timeR);
    svg.append('rect').attrs({
      x: x - 10,
      y: y - h,
      width: 20,
      height: h,
      fill: 'none',
      stroke: '#555',
    });
    y = zero_y - boxInfo.q2 * timeR;
    svg.append('line').attrs({
      x1: x - 10,
      x2: x + 10,
      y1: y,
      y2: y,
      stroke: '#555',
      'stroke-width': '2px'
    });
    const y_start = zero_y - boxInfo.min * timeR;
    const y_end = zero_y - boxInfo.max * timeR;
    svg.append('line').attrs({
      x1: x,
      x2: x,
      y1: y_start,
      y2: y_end,
      stroke: '#555',
    });
    svg.append('line').attrs({
      x1: x - 7,
      x2: x + 7,
      y1: y_start,
      y2: y_start,
      stroke: '#555',
    });
    svg.append('line').attrs({
      x1: x - 7,
      x2: x + 7,
      y1: y_end,
      y2: y_end,
      stroke: '#555',
    });
  }
}

function getBox (arr) {
  arr = arr.length === 0 ? [0] : arr;
  const sorted = arr.sort((a, b) => a - b);
  const len = arr.length;
  return {
    min: sorted[0],
    max: sorted[len - 1],
    q1: sorted[Math.floor((len - 1) * 1 / 4)],
    q2: sorted[Math.floor((len - 1) * 2 / 4)],
    q3: sorted[Math.floor((len - 1) * 3 / 4)],
  }
}

/**
 * Get Samples with bootstrap algorithm.
 * It allows duplicated sample instance and over-sampling.
 * @param {Array} data 
 * @param {number} numOfSamples 
 */
function bootstrap (data, numOfSamples) {
  const numOfInstances = data.length;
  const bootstrapedSamples = []
  for (let i = 0; i < numOfSamples; i++) {
    const randomIdx = getRandomInteger(0, numOfInstances - 1);
    const instance = data[randomIdx];
    bootstrapedSamples.push(instance);
  }
  return bootstrapedSamples;
}

/**
 * Get a random interger in between min (inclusive) and max (inclusive).
 * @param {number} min The minimum integer of random number
 * @param {number} max The maximum integer of random number
 */
function getRandomInteger (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// test function
function testBootstrap () {
  data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  cnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  for (let i = 0; i < 1000; i++) {
    const bt = bootstrap(data, 100);
    for (let sample of bt) {
      cnt[sample] += 1;
    }
  }
  console.log(cnt);
}

async function getDataset () {
  return await d3.csv("./data/test_colormap(1).csv", d => {
    const leftCls = Math.abs(d['TargetNode_value'] - d['ComparisonNode_left']);
    const rightCls = Math.abs(d['TargetNode_value'] - d['ComparisonNode_right']);
    const correctNodeValue = leftCls < rightCls ? d['ComparisonNode_left'] : d['ComparisonNode_right'];
    let valueArea = Math.floor(correctNodeValue * 3);
    valueArea = valueArea < 0 ? 0 : valueArea;
    valueArea = valueArea > 2 ? 2 : valueArea;
    const colormapNames = {
      'single_blue': 'blue',
      'viridis': 'viridis',
      'jet': 'jet',
      'red_blue': 'RdYlBu'
    }
    return {
      dataname: d['data'],
      centrality: d['NodeAttributes'],
      nodeValue: correctNodeValue,
      colormap: colormapNames[d['colormap']],
      span: d['span'] * 1,
      valueArea: valueArea,
      time: d['time'] * 1,
      correctness: d['isCorrect'],
    }
  });
}

/**
 * 조건(key-value)을 만족하는 인스턴스의 특정 값 배열을 반환한다.
 * @param {*} arr 오브젝트 배열
 * @param {*} condition 필터링할 조건의 key와 value
 * @param {*} key 필터링된 인스턴스에서 얻고 싶은 값
 * 
 * Ex. 
 * array = [{gender: 'male', age: 26}, {gender: 'male', age: 24},
 *          {gender: 'female', age: 25}, {gender: 'female', age: 27}];
 * conditions =  [{key: 'gender', value:'male'}];
 * key = 'age'
 * getConditioned(array, conditions, key) 
 * // It returns [26, 24] 
 */
function getConditioned (arr, conditions, key1, key2) {
  const ret = []
  for (let i = 0; i < arr.length; i++) {
    const elem = arr[i];
    let cnt = 0;
    for (let j = 0; j < conditions.length; j++) {
      const cond = conditions[j];
      if (elem[cond.key] == cond.value) cnt++;
    }
    if (elem[key2] > 30) continue; // 30초 이상 걸린 테스크는 필터링하자. 딴짓햇을 확률 겁나 높음 
    if (cnt === conditions.length) ret.push([elem[key1], elem[key2]]);
  }
  return ret;
}

/**
 * 조건 목록(조합)을 반환합니다.
 * @param {*} datanames 
 * @param {*} centralities
 * @param {*} colormaps
 * @param {*} spans 
 */
function getConditionList (datanames, centralities, colormaps, spans, ) {
  const conditions = [];
  _.forEach(datanames, dataname => {
    _.forEach(centralities, cent => {
      _.forEach(colormaps, colormap => {
        _.forEach(spans, span => {
          conditions.push([
            { key: 'dataname', value: dataname },
            { key: 'centrality', value: cent },
            { key: 'colormap', value: colormap },
            { key: 'span', value: span },
          ]);
        })
      })
    });
  });
  return conditions;
}