const Constant = {
  that: this,
  // https://github.com/d3/d3-scale-chromatic
  colorMaps: {
    single_blue: d3.interpolateBlues,
    single_grey: d3.interpolateGreys,
    inferno: d3.interpolateInferno,
    divergent_red_blue: d3.interpolateRdYlBu,
    viridis: d3.interpolateViridis,
    'brewer_yellow-green-blue': d3.interpolateYlGnBu,
    rainbow: d3.interpolateRainbow,
    magma: d3.interpolateMagma,
    plasma: d3.interpolatePlasma,
    single_greens: d3.interpolateGreens,
    heat: d3.interpolateYlOrRd
  },
  dataNames: ['lesmis', 'football', 'jazz'],
  centralityNames: ['page', 'random'],
  colorMapNames: ['single_blue', 'rainbow', 'divergent_red_blue', 'viridis'],
  spans: [0.15, 0.4]
  // data(3) cent(2) color(4) span(2) => 48
};

const Data = new (function() {
  this.dataset = {};
  const that = this;
  const allDataNames = [
    'dolphins',
    'football',
    'karate',
    'lesmis',
    'netscience',
    'jazz'
  ];
  this.road = async () => {
    for (let i = 0; i < allDataNames.length; i++) {
      that.dataset[allDataNames[i]] = await $.getJSON(
        './data/' + allDataNames[i] + '.json'
      );
    }
  };
  this.getData = dataName => {
    return that.dataset[dataName];
  };
  return this;
})();
Data.road();

const Page = [
  `
<div class="content">
  <div class="sub-title">Instructions</div>
  <div class="description">
    Todays user study is about <b>“Colormaps in Network Visualization/Graph”</b> (Node link diagram). This is a research study.
    We want to understand how to best show network data with respect to color scales/schemes used for representing the nodes.
    We will present some visualizations (node link diagram) of different data sets with links between those nodes.
    This experiment involves 48 tasks. The estimated time for this experiment is about 15 minutes.
  </div>
  <div class="description">
    오늘의 사용자 연구는 <b>"네트워크 시각화/그래프에서 컬러맵별 사용성 평가"</b>에 관한 것입니다. 
    우리는 노드를 나타내는 데 사용되는 색상 스케일 / 체계와 관련하여 네트워크 데이터를 가장 잘 표시하는 방법을 이해하고자합니다.
    우리는 노드들 사이의 링크를 가진 다른 데이터 세트의 시각화 (노드 링크 다이어그램)를 제시 할 것입니다.
    이 실험은 48개의 문항으로 이뤄져있으며, 이를 수행하기 위해 15분 내외의 시간이 필요합니다.
  </div>
  <br>
  <div class="flex-zone">
    <div class="empty-flex-1"></div>
    <div class="image-wrapper flex-4">
      <img id='diagram-img' src="image/network_diagram.png" alt="node link diagram" height="300">
    </div>
    <div class="image-wrapper flex-4">
      <img id='diagram-img' src="image/network-diagram-re.png" alt="node link diagram" height="300">
    </div>
    <div class="empty-flex-1"></div>
  </div>
  <br>
  <div class="description">
    This type of visualisation shows how things are interconnected through the use of nodes / vertices and link lines to represent their connections and help illuminate the type of relationships between a group of entities.
  </div>
  <div class="description">
    이러한 시각화는 노드(점)와 링크(선)를 사용하여 연결 상태를 나타내어 개체 그룹 간의 관계를 밝히는 데 도움이 됩니다.    
  </div>
  <br>
  <br>
  <div class="sub-title">Task</div>
  <div class="description">
    You will be shown an node link diagram. 
    <br> In that diagram there will be three highlighted nodes.
    <br> <b>1. Reference node</b> :  A reference node  highlighted by a black circle around it. 
    <img id='ref node img' src="image/ref_nd.png" alt="node link diagram" height="15">
    <br> <b>2. Comparison nodes</b> : Comparison nodes will be highlighted by a black square around them. 
    <img id='comp node img' src="image/comp_nd.png" alt="node link diagram" height="15">
    <img id='ref node img' src="image/comp_nd2.png" alt="node link diagram" height="15">
    <br> A colormap will be shown along with the node link diagram. 
  </div>
  <div class="description">
    노드 링크 다이어그램이 아래와 같이 표시됩니다.
    <br> 다이어그램에는 강조된 3개의 노드가 있습니다.
    <br> <b>1. 한개의 레퍼런스 노드</b> :  검정색 테두리를 가진 원으로 표시됩니다.
    <img id='ref node img' src="image/ref_nd.png" alt="node link diagram" height="15">
    <br> <b>2. 두개의 비교노드</b> : 검정색 테두리를 가진 사각형으로 표시됩니다.
    <img id='comp node img' src="image/comp_nd.png" alt="node link diagram" height="15">
    <img id='ref node img' src="image/comp_nd2.png" alt="node link diagram" height="15">
    <br> 다이어그램과 함께 컬러맵도 표시됩니다.
  </div>
  <br> 
  <div class="image-wrapper flex-4">
    <img id='diagram-img' src="image/network-diagram-co.png" alt="node link diagram" height="400">
  </div>
  <div class="description">
    Based on given colormap, you will be asked to select one of the two comparison nodes which you think is closer to the reference node.
    In order to perform the task you have to click one  of the two comparison nodes as your answer to that task.
    For each task your reaction time and correctness (true/false) to that task will be recorded.
    Please perform that task as fast and accurate as possible by utilizing the graph and colormap given.
  </div>
  <div class="description">
    주어진 색상 맵에 따라 참조 노드에 더 가깝다고 생각되는 두 개의 비교 노드 중 하나를 선택하십시오.
    작업을 수행하려면 두 비교 노드 중 하나를 클릭해야합니다.
    각 작업마다 해당 작업에 대한 반응 시간과 정확성 (true / false)이 기록됩니다.
    주어진 그래프와 컬러 맵을 이용하여 가능한 한 빠르고 정확하게 작업을 수행하십시오.  
  </div>
  <div class="button next-page-button" id="startColorBlind">Got it! Take me to the Study</div>
</div>
  `,
  `
  <style>
        .test_image-wrapper {
            display: inline-block;
            width: 250px;
            height: 270px;
            padding: 10px;
        }

        .test_image-wrapper img {
            width: 250px;
            display: inline-block;
        }

        .test_image-wrapper input {
            width: 250px;
            font-size: 18px;
            height: 30px;
            line-height: 30px;
            text-align: right;
        }
    </style>
    <div class="content">
    <div class="description">This study examines the usability of colors in network visualizations. Therefore, before
        the experiment, you need a color-blind test.
    </div>
    <div class="description">이 연구는 네트워크 시각화에서 색상의 사용성을 검토합니다. 따라서 실험 전에 색맹 검사를 받아야 합니다.
    </div>
    <div class="description">Look at the picture below and enter what number you see.</div>
    <div class="description">아래 사진을 보고 보이는 숫자를 입력해 주세요.</div>
    <br>
    <div class="flex-zone">
        <div class="empty-flex-1"></div>
        <div class="test_image-wrapper flex-2">
            <img id='color-blind-img_1' src="image/color-blind/1.gif" alt="color blind test">
            <input id="blind_test_1">
        </div>
        <div class="empty-flex-1"></div>
        <div class="test_image-wrapper flex-2">
            <img id='color-blind-img_2' src="image/color-blind/2.gif" alt="color blind test">
            <input id="blind_test_2">
        </div>
        <div class="empty-flex-1"></div>
        <div class="test_image-wrapper flex-2">
            <img id='color-blind-img_3' src="image/color-blind/3.gif" alt="color blind test">
            <input id="blind_test_3">
        </div>
        <div class="empty-flex-1"></div>
    </div>
    <br>
    <div class="flex-zone">
        <div class="empty-flex-1"></div>
        <div class="test_image-wrapper flex-2">
            <img id='color-blind-img_4' src="image/color-blind/4.gif" alt="color blind test">
            <input id="blind_test_4">
        </div>
        <div class="empty-flex-1"></div>
        <div class="test_image-wrapper flex-2">
            <img id='color-blind-img_5' src="image/color-blind/5.gif" alt="color blind test">
            <input id="blind_test_5">
        </div>
        <div class="empty-flex-1"></div>
        <div class="test_image-wrapper flex-2">
            <img id='color-blind-img_6' src="image/color-blind/6.gif" alt="color blind test">
            <input id="blind_test_6">
        </div>
        <div class="empty-flex-1"></div>
    </div>
    <br>
    <br>
    </div>
    <div class="button next-page-button" id="startTutorial">Complete</div>
  `,
  `
<div id="app">
  <div class="render-area">
    <svg id="network"></svg>
    <svg id="legend"></svg>
  </div>
  <dlv class="desc-area">
    <div class="task-desc"></div>
    <div class="task-nodes-desc"></div>
    <div class="result-desc"></div>
  </dlv>
</div>
  `,
  `
  <div class='thankyou'>
    User study end here. Thank you so much for you time.
    <br><br>실험이 종료되었습니다. 참여해주셔서 감사합니다.
  </div>`
];
