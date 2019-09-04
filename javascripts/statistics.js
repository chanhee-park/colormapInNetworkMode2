main();

async function main() {
    const datanames = ['lesmis', 'football', 'jazz'];
    const centralities = ['page', 'random'];
    const spans = [0.15, 0.40];
    const colormaps = ['blue', 'divergent', 'rainbow', 'viridis'];

    const dataset = await getDataset();
    const conditions = getConditionList(datanames, centralities, spans)

    _.forEach(colormaps, colormap => {
        _.forEach(conditions, condition => {
            console.log(colormap, condition[0].value, condition[1].value, condition[2].value);
            const filltered = getConditioned(dataset, condition, `${colormap}_t`);
            console.log(filltered);
            // 색, 데이터, 중심성, 스팬 별로 데이터 필터링 완료
            // TODO: 각 필터된 애들 별로 부트스트랩 진행
            // TODO: 값이 높고 낮은 정도에 따라 나누기
            // TODO: 각각 평균과 표준편차 구하기
            // TODO: 그리기
        })
    })
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
    return await d3.csv("./data/test_colormap.csv",
        function(d) {
            return {
                data: d['data'],
                centrality: d['NodeAttributes'],
                span: d['span'],
                blue_c: d['blue-c'],
                blue_t: d['blue-t'] * 1,
                divergent_c: d['divergent-c'],
                divergent_t: d['divergent-t'] * 1,
                rainbow_c: d['rainbow-c'],
                rainbow_t: d['rainbow-t'] * 1,
                viridis_c: d['viridis-c'],
                viridis_t: d['viridis-t'] * 1,
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
function getConditioned(arr, conditions, key) {
    const ret = []
    for (let i = 0; i < arr.length; i++) {
        const elem = arr[i];
        let cnt = 0;
        for (let j = 0; j < conditions.length; j++) {
            const cond = conditions[j];
            if (elem[cond.key] == cond.value) cnt++;
        }
        if (cnt === conditions.length) ret.push(elem[key]);
    }
    return ret;
}

/**
 * 조건 목록(조합)을 반환합니다.
 * @param {*} datanames 
 * @param {*} centralities 
 * @param {*} spans 
 */
function getConditionList(datanames, centralities, spans) {
    const conditions = [];
    _.forEach(datanames, dataname => {
        _.forEach(centralities, cent => {
            _.forEach(spans, span => {
                conditions.push([
                    { key: 'data', value: dataname },
                    { key: 'centrality', value: cent },
                    { key: 'span', value: span },
                ]);
            });
        });
    });
    return conditions;
}