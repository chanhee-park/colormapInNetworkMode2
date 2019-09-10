main();

async function main() {
    const svg = d3.select('svg#statistics');

    const datanames = ['lesmis', 'football', 'jazz'];
    const centralities = ['page', 'random'];
    const colormaps = ['blue', 'RdYlBu', 'jet', 'viridis'];
    const spans = [0.15, 0.40];
    const valueArea = [0, 1, 2];

    const dataset = await getDataset();
    const conditions = getConditionList(datanames, centralities, colormaps, spans);

    _.forEach(conditions, (condition, c_idx) => {
        const filltered = getConditioned(dataset, condition, 'nodeValue', 'time');
        drawInstances(svg, c_idx, condition, filltered);
        const bootstraped = bootstrap(filltered, 1000);
        //     // TODO: 값이 높고 낮은 정도에 따라 나누기 : Problem - 값이 대부분 비슷해서 구간을 나눌 수 없다.
        //     // TODO: 각각 평균과 표준편차 구하기
        //     // TODO: 그리기
    })

}

function drawInstances(svg, idx, condition, instances) {
    const w = 250;
    const h = 100;
    const margin = 100;
    svg.append('line').attrs({
        x1: margin,
        x2: margin + w,
        y1: idx * (h + margin) + h,
        y2: idx * (h + margin) + h,
        stroke: '#555'
    });
    svg.append('line').attrs({
        x1: margin,
        x2: margin,
        y1: idx * (h + margin),
        y2: idx * (h + margin) + h,
        stroke: '#555'
    });
    svg.append('line').attrs({
        x1: 0,
        x2: margin + w * 2,
        y1: idx * (h + margin) + h + margin * 3 / 4,
        y2: idx * (h + margin) + h + margin * 3 / 4,
        stroke: '#aaa'
    });
    svg.append('text').text(`${condition[0].value},  ${condition[1].value},  ${condition[2].value},  ${condition[3].value}`).attrs({
        x: margin,
        y: idx * (h + margin) + h + margin / 2,
    });
    svg.append('text').text('value').attrs({
        x: margin + w - 20,
        y: idx * (h + margin) + h + 40,
    });
    svg.append('text').text('time').attrs({
        x: margin - 60,
        y: idx * (h + margin) + 15,
    });

    const time = [0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30];
    const value = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, '', ''];
    const zero_x = margin;
    const zero_y = idx * (h + margin) + h;
    const valueR = 250;
    const timeR = 3;

    for (let i = 0; i <= 12; i += 2) {
        let x = zero_x + value[i] * valueR;
        let y = zero_y - time[i] * timeR;
        svg.append('text').text(value[i]).attrs({
            x: x,
            y: zero_y + 20,
        });
        svg.append('text').text(time[i]).attrs({
            x: zero_x - 20,
            y: y,
        });
    }
    for (let i = 0; i < instances.length; i++) {
        let x = zero_x + instances[i][0] * valueR;
        let y = zero_y - instances[i][1] * timeR;
        if (instances[i][1] > 30) continue;
        svg.append('circle').attrs({
            cx: x,
            cy: y,
            r: 3,
            fill: '#052',
            opacity: 0.2
        });
    }
}

/**
 * Get Samples with bootstrap algorithm.
 * It allows duplicated sample instance and over-sampling.
 * @param {Array} data 
 * @param {number} numOfSamples 
 */
function bootstrap(data, numOfSamples) {
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
function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// test function
function testBootstrap() {
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

async function getDataset() {
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
function getConditioned(arr, conditions, key1, key2) {
    const ret = []
    for (let i = 0; i < arr.length; i++) {
        const elem = arr[i];
        let cnt = 0;
        for (let j = 0; j < conditions.length; j++) {
            const cond = conditions[j];
            if (elem[cond.key] == cond.value) cnt++;
        }
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
function getConditionList(datanames, centralities, colormaps, spans, ) {
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