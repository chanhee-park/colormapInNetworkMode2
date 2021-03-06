function drawGraph (dataName, refCentrality, colorMapName, span, testIdx, mode) {
  const startTime = Util.getTime();
  const graph = Data.getData(dataName);
  const colorMap = Constant.colorMaps[colorMapName];
  let rotate = Math.random() * 360;
  let scale = 1;
  let moveX = dataName === 'jazz' ? -25 : 0;
  let moveY = dataName === 'jazz' ? -70 : 0;
  if (refCentrality === 'random') setRandCentrality();

  console.log("TASK", testIdx, ": ", dataName, refCentrality, colorMapName, span);

  if (mode === 'tutorial') {
    $('.task-desc').html('<br>Tutorial : ' + (testIdx + 1) + '/3</br>');
  } else {
    $('.task-desc').html('<br>Task : ' + (testIdx + 1) + '/48</br>');
  }
  $('.result-desc').text('');

  // Set Render Size
  const svgHTML = document.getElementById('network');
  const svg = d3.select('svg#network'),
    legendSvg = d3.select('svg#legend'),
    svgWidth = svgHTML.height.baseVal.value,
    svgHeight = svgHTML.height.baseVal.value,
    width = svgHeight * (dataName === 'jazz' ? 0.85 : 0.75);
  height = svgHeight * (dataName === 'jazz' ? 0.85 : 0.75);

  svg.selectAll('*').remove();
  legendSvg.selectAll('*').remove();

  // No Magic Number !
  const nodeRadius = dataName === 'jazz' ? 5 : 7,
    linkColor = '#000',
    linkOpacity = 0.15,
    legendX = 25,
    legendY = 30,
    legendSize = 27;

  let maxAxisVal = undefined,
    minCentralityVal = undefined,
    maxCentralityVal = undefined;

  let C1, C2, T;

  setAxisInfo();
  drawColorLegend();
  drawLinks();
  drawNodes();
  drawTargets();
  transformDiagram();

  /**
   * Set Axis Information
   */
  function setAxisInfo () {
    // position
    const maxXNode = _.maxBy(graph.nodes, function (node) {
      return Math.abs(node.x);
    });
    const maxAbsX = Math.abs(maxXNode.x);
    const maxYNode = _.maxBy(graph.nodes, function (node) {
      return Math.abs(node.y);
    });
    const maxAbsY = Math.abs(maxYNode.y);
    maxAxisVal = maxAbsX > maxAbsY ? maxAbsX : maxAbsY;

    // centrality
    const minCentralityNode = _.minBy(graph.nodes, function (node) {
      return node[refCentrality];
    });
    minCentralityVal = minCentralityNode[refCentrality];
    const maxCentralityNode = _.maxBy(graph.nodes, function (node) {
      return node[refCentrality];
    });
    maxCentralityVal = maxCentralityNode[refCentrality];
  }

  /**
   * Draw Color Legend
   */
  function drawColorLegend () {
    let w_ratio = svgHTML.width.baseVal.value / 300;

    legendSvg
      .append('text')
      .text('low')
      .attrs({
        x: legendX,
        y: legendY - 5,
        'text-anchor': 'start',
        'alignment-baseline': 'ideographic'
      });
    legendSvg
      .append('text')
      .text('high')
      .attrs({
        x: legendX + 255 * w_ratio,
        y: legendY - 5,
        'text-anchor': 'middle',
        'alignment-baseline': 'ideographic'
      });

    for (let i = 0; i <= 255; i++) {
      const relative = i / 255;
      const virtualCentrality = Util.getAbsoluteVal(
        relative,
        minCentralityVal,
        maxCentralityVal
      );
      const color = getColorString(virtualCentrality);
      legendSvg.append('rect').attrs({
        x: legendX + i * w_ratio,
        y: legendY,
        width: 6,
        height: legendSize,
        fill: color
      });
    }
  }

  /**
   * Draw Nodes
   */
  function drawNodes () {
    _.forEach(graph.nodes, function (node) {
      drawNode(node);
    });
  }

  function drawNode (node, type) {
    const coord = getCoord({ x: node.x, y: node.y });
    let color = getColorString(node[refCentrality]);

    let addedRadius = type !== undefined ? 4 : 0;
    let stroke = type === 'source' ? '#F00' : 'none';
    stroke = type === 'target' ? '#000' : stroke;

    svg
      .append('circle')
      .attrs({
        cx: coord.x,
        cy: coord.y,
        r: nodeRadius + addedRadius,
        fill: color,
        stroke: stroke,
        'stroke-width': '3px'
      })
      .classed('node', true)
      .classed(type, true);
  }

  function drawRectNode (node, type) {
    const coord = getCoord({ x: node.x, y: node.y });
    let color = getColorString(node[refCentrality]);

    svg
      .append('rect')
      .attrs({
        x: coord.x - nodeRadius - 2,
        y: coord.y - nodeRadius - 2,
        width: nodeRadius * 2 + 4,
        height: nodeRadius * 2 + 4,
        fill: color,
        stroke: '#000',
        'stroke-width': '3px'
      })
      .classed('node', true)
      .classed(type, true)
      .on('click', function () {
        d3.selectAll('.node').on('click', null); // 아래 함수들이 시간 소모가 많아서, 이벤트 삭제를 먼저 해준다. 
        checkAnswerResult(node);
        showNextTask();
      });
  }

  function drawTargets () {
    const targetIds = getTargetSet(graph.nodes, refCentrality, span);
    const targetNodes = Util.shuffle([
      graph.nodes[targetIds[0]],
      graph.nodes[targetIds[1]],
      graph.nodes[targetIds[2]]
    ]);

    C1 = targetNodes[0];
    C2 = targetNodes[1];
    T = targetNodes[2];

    drawRectNode(C1, 'source');
    drawRectNode(C2, 'source');
    drawNode(T, 'target');

    /*** TEST START : 노드 값 디버그 텍스트 띄우기 */
    // showDebugText(T, C1, C2);
    /*** TEST END : 노드 값 디버그 텍스트 띄우기 */

    // showNodeInLegend(C1, 'r');
    // showNodeInLegend(C2, 'r');
    // showNodeInLegend(T, 'c');
  }

  function showNodeInLegend (node, type) {
    const relative = Util.getRelativeVal(
      node[refCentrality],
      minCentralityVal,
      maxCentralityVal
    );
    const virtualCentrality = Util.getAbsoluteVal(
      relative,
      minCentralityVal,
      maxCentralityVal
    );
    let w_ratio = svgHTML.width.baseVal.value / 300;
    const color = getColorString(virtualCentrality);

    /*** TEST START : 컬러 레전드에 노드의 위치 보여주기 ***/
    if (type === 'r') {
      legendSvg.append('rect').attrs({
        x: legendX + relative * 255 * w_ratio,
        y: legendY + legendSize + 5,
        width: 25,
        height: 25,
        fill: color,
        stroke: '#000'
      });
    } else if (type === 'c') {
      legendSvg.append('circle').attrs({
        cx: legendX + relative * 255 * w_ratio + 13,
        cy: legendY + legendSize + 5 + 13,
        r: 13,
        fill: color,
        stroke: '#000'
      });
      /*** TEST END : 컬러 레전드에 노드의 위치 보여주기 ***/
    }
  }

  function showDebugText (T, C1, C2) {
    $('.task-nodes-desc').html(
      'span:' + span +
      '<br><br>Values' +
      '<br> C1: ' +
      Util.roundFrom(
        Util.getRelativeVal(
          C1[refCentrality],
          minCentralityVal,
          maxCentralityVal
        )
      ) +
      '<br> C2: ' +
      Util.roundFrom(
        Util.getRelativeVal(
          C2[refCentrality],
          minCentralityVal,
          maxCentralityVal
        )
      ) +
      '<br> T : ' +
      Util.roundFrom(
        Util.getRelativeVal(
          T[refCentrality],
          minCentralityVal,
          maxCentralityVal
        )
      ) +
      '<br><br>Luminances' +
      '<br> C1: ' +
      Util.roundFrom(Color.getLuminance(Color.getRGB(getColorString(C1[refCentrality])))) +
      '<br> C2: ' +
      Util.roundFrom(Color.getLuminance(Color.getRGB(getColorString(C2[refCentrality])))) +
      '<br> T : ' +
      Util.roundFrom(Color.getLuminance(Color.getRGB(getColorString(T[refCentrality]))))
    );
  }


  /**
   * Draw Links
   */
  function drawLinks () {
    _.forEach(graph.links, function (link) {
      const sourceNodeIdx = link.source;
      const targetNodeIdx = link.target;
      const sourceCoord = getCoord(graph.nodes[sourceNodeIdx]);
      const targetCoord = getCoord(graph.nodes[targetNodeIdx]);

      svg
        .append('line')
        .attrs({
          x1: sourceCoord.x,
          x2: targetCoord.x,
          y1: sourceCoord.y,
          y2: targetCoord.y,
          stroke: linkColor,
          opacity: dataName === 'jazz' ? linkOpacity / 3 : linkOpacity
        })
        .classed('edge', true);
    });
  }

  function transformDiagram () {
    d3.selectAll('.node').attr(
      'transform',
      `rotate(${rotate}, ${svgWidth / 2}, ${svgHeight /
      2}) scale(${scale}, ${scale}) translate(${moveX}, ${moveY})`
    );

    d3.selectAll('.edge').attr(
      'transform',
      `rotate(${rotate}, ${svgWidth / 2}, ${svgHeight /
      2}) scale(${scale}, ${scale}) translate(${moveX}, ${moveY})`
    );
  }

  /**
   * 'pos' is the coordinate with center point (0,0).
   * Returns the top-left point to be (0,0).
   * @param pos
   * @returns {{x: number, y: number}}
   */
  function getCoord (pos) {
    return {
      x: svgWidth / 2 + (pos.x / maxAxisVal) * (width / 2),
      y: svgHeight / 2 + (pos.y / maxAxisVal) * (height / 2)
    };
  }

  /**
   * Get Hexadecimal Color from centrality
   * @param centrality
   * @returns {rgbColor: string} such as 'rgb({r}, {g}, {b})' or '#F0E357'
   */
  function getColorString (centrality) {
    let relativeVal = Util.getRelativeVal(
      centrality,
      minCentralityVal,
      maxCentralityVal
    );
    return colorMap(relativeVal);
  }

  function setRandCentrality () {
    _.forEach(graph.nodes, node => {
      node['random'] = Math.random();
    });
  }

  function showNextTask () {
    if (mode === 'tutorial') {
      setTimeout(function () {
        tutorialTest(testIdx + 1);
      }, 2500)
    } else {
      svg.selectAll('*').remove();
      legendSvg.selectAll('*').remove();
      userTest(testIdx + 1);
    }
  }

  function checkAnswerResult (userAnswerNode) {
    const diff1 = Math.abs(T[refCentrality] - C1[refCentrality]);
    const diff2 = Math.abs(T[refCentrality] - C2[refCentrality]);
    const correctNode = diff1 < diff2 ? C1 : C2;

    const elapsedTime = Util.getTimeDiffFrom(startTime);
    const isCorrect = userAnswerNode === correctNode;
    console.log('RESULT:', elapsedTime, isCorrect);

    const classToAdd = isCorrect ? 'correct' : 'wrong';
    const classToRemove = !isCorrect ? 'correct' : 'wrong';

    if (mode === 'tutorial') {
      $('.result-desc')
        .text(elapsedTime + ', ' + classToAdd)
        .removeClass(classToRemove)
        .addClass(classToAdd);
    } else {
      TEST_DATA.test.push({
        dataName: dataName,
        refCentrality: refCentrality,
        colormap: colorMapName,
        span: span,
        elapsedTime: elapsedTime,
        isCorrect: isCorrect,
        targetValue: (T[refCentrality] - minCentralityVal) / (maxCentralityVal - minCentralityVal),
        compare1Value: (C1[refCentrality] - minCentralityVal) / (maxCentralityVal - minCentralityVal),
        compare2Value: (C2[refCentrality] - minCentralityVal) / (maxCentralityVal - minCentralityVal),
        targetColor: Color.getRGB(getColorString(T[refCentrality])),
        compare1Color: Color.getRGB(getColorString(C1[refCentrality])),
        compare2Color: Color.getRGB(getColorString(C2[refCentrality])),
        targetLum: Color.getLuminance(Color.getRGB(getColorString(T[refCentrality]))),
        compare1Lum: Color.getLuminance(Color.getRGB(getColorString(C1[refCentrality]))),
        compare2Lum: Color.getLuminance(Color.getRGB(getColorString(C2[refCentrality]))),
        selectedNode: diff1 < diff2 ? 'compare1' : 'compare2',
        correctNode: correctNode === C1 ? 'compare1' : 'compare2',
      });
    }
    console.log("TEST_DATA: ", TEST_DATA);
  }
}
