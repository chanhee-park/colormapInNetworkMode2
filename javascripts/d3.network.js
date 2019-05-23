function drawGraph(dataName, refCentrality, colorMapName, span, testIdx) {
  const startTime = Util.getTime();
  const graph = Data.getData(dataName);
  const colorMap = Constant.colorMaps[colorMapName];

  // setTimeout(function() {
  //   userTest(testIdx + 1);
  // }, 1000);

  let rotate = Math.random() * 360;
  let scale = 1;
  let moveX = dataName === 'jazz' ? -25 : 0;
  let moveY = dataName === 'jazz' ? -70 : 0;

  if (refCentrality === 'random') setRandCentrality();

  console.log(dataName, refCentrality, colorMapName, span);

  if (testIdx < 0) {
    $('.task-desc').text('Tutorial : ' + (testIdx + 4) + '/3');
  } else {
    $('.task-desc').text('Task : ' + testIdx + 1 + '/48');
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

  let correctNode = undefined;

  setAxisInfo();
  drawColorLegend();
  drawLinks();
  drawNodes();
  drawTargets();
  transformDiagram();

  /**
   * Set Axis Information
   */
  function setAxisInfo() {
    // position
    const maxXNode = _.maxBy(graph.nodes, function(node) {
      return Math.abs(node.x);
    });
    const maxAbsX = Math.abs(maxXNode.x);
    const maxYNode = _.maxBy(graph.nodes, function(node) {
      return Math.abs(node.y);
    });
    const maxAbsY = Math.abs(maxYNode.y);
    maxAxisVal = maxAbsX > maxAbsY ? maxAbsX : maxAbsY;

    // centrality
    const minCentralityNode = _.minBy(graph.nodes, function(node) {
      return node[refCentrality];
    });
    minCentralityVal = minCentralityNode[refCentrality];
    const maxCentralityNode = _.maxBy(graph.nodes, function(node) {
      return node[refCentrality];
    });
    maxCentralityVal = maxCentralityNode[refCentrality];
  }

  /**
   * Draw Color Legend
   */
  function drawColorLegend() {
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
      const color = getHexColor(virtualCentrality);
      legendSvg.append('rect').attrs({
        x: legendX + i * w_ratio,
        y: legendY,
        width: 5,
        height: legendSize,
        fill: color
      });
    }
  }

  /**
   * Draw Nodes
   */
  function drawNodes() {
    _.forEach(graph.nodes, function(node) {
      drawNode(node);
    });
  }

  function drawNode(node, type) {
    const coord = getCoord({ x: node.x, y: node.y });
    let color = getHexColor(node[refCentrality]);

    let addedRadius = type !== undefined ? 1.5 : 0;
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
      .classed(type, true)
      .on('click', function() {
        console.log(node);
        if (type === 'source') {
          checkAnswerResult(node);
        }
      });
  }

  function drawRectNode(node, type) {
    const coord = getCoord({ x: node.x, y: node.y });
    let color = getHexColor(node[refCentrality]);

    svg
      .append('rect')
      .attrs({
        x: coord.x - nodeRadius - 1,
        y: coord.y - nodeRadius - 1,
        width: nodeRadius * 2 + 2,
        height: nodeRadius * 2 + 2,
        fill: color,
        stroke: '#000',
        'stroke-width': '3px'
      })
      .classed('node', true)
      .classed(type, true)
      .on('click', function() {
        if (type === 'source') {
          checkAnswerResult(node);
        }
      });
  }

  function drawTargets() {
    const targetIds = getTargetSet(graph.nodes, refCentrality, span);
    const targetNodes = Util.shuffle([
      graph.nodes[targetIds[0]],
      graph.nodes[targetIds[1]],
      graph.nodes[targetIds[2]]
    ]);

    const C1 = targetNodes[0];
    const C2 = targetNodes[1];
    const T = targetNodes[2];

    showCompares([C1, C2]);
    showTarget(T);

    const diff1 = Math.abs(T[refCentrality] - C1[refCentrality]);
    const diff2 = Math.abs(T[refCentrality] - C2[refCentrality]);
    correctNode = diff1 < diff2 ? C1 : C2;

    drawRectNode(C1, 'source');
    drawRectNode(C2, 'source');
    drawNode(T, 'target');

    $('.task-nodes-desc').html(
      span +
        '<br>' +
        Util.getRelativeVal(
          graph.nodes[targetIds[0]][refCentrality],
          minCentralityVal,
          maxCentralityVal
        ) +
        '<br>' +
        Util.getRelativeVal(
          graph.nodes[targetIds[1]][refCentrality],
          minCentralityVal,
          maxCentralityVal
        ) +
        '<br>' +
        Util.getRelativeVal(
          graph.nodes[targetIds[2]][refCentrality],
          minCentralityVal,
          maxCentralityVal
        ) +
        '<br>'
    );
  }

  function showCompares(nodes) {
    for (const node of nodes) {
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
      const color = getHexColor(virtualCentrality);

      legendSvg.append('rect').attrs({
        x: legendX + relative * 255 * w_ratio,
        y: legendY + legendSize + 5,
        width: 25,
        height: 25,
        fill: color,
        stroke: '#000'
      });
    }
  }

  function showTarget(node) {
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
    const color = getHexColor(virtualCentrality);

    legendSvg.append('circle').attrs({
      cx: legendX + relative * 255 * w_ratio + 12.5,
      cy: legendY + legendSize + 5 + 12.5,
      r: 12.5,
      fill: color,
      stroke: '#000'
    });
  }

  /**
   * Draw Links
   */
  function drawLinks() {
    _.forEach(graph.links, function(link) {
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

  function transformDiagram() {
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
  function getCoord(pos) {
    return {
      x: svgWidth / 2 + (pos.x / maxAxisVal) * (width / 2),
      y: svgHeight / 2 + (pos.y / maxAxisVal) * (height / 2)
    };
  }

  /**
   * Get Hexadecimal Color from centrality
   * @param centrality
   * @returns {string} : rgb({r}, {g}, {b})
   */
  function getHexColor(centrality) {
    const relativeVal = Util.getRelativeVal(
      centrality,
      minCentralityVal,
      maxCentralityVal
    );
    let nonZeroVal = relativeVal;
    if (colorMapName === 'single_blue') {
      nonZeroVal = (relativeVal + 0.2) / 1.2;
    } else if (colorMapName === 'rainbow') {
      nonZeroVal = (relativeVal + 0.3) / 1.3;
    }
    return colorMap(nonZeroVal);
  }

  function setRandCentrality() {
    _.forEach(graph.nodes, node => {
      node['random'] = Math.random();
    });
  }

  function checkAnswerResult(userAnswerNode) {
    const elapsedTime = Util.getTimeDiffFrom(startTime);
    const isCorrect = userAnswerNode === correctNode;
    console.log('result : ', elapsedTime, isCorrect);

    const classToAdd = isCorrect ? 'correct' : 'wrong';
    const classToRemove = !isCorrect ? 'correct' : 'wrong';

    if (testIdx < 0) {
      $('.result-desc')
        .text(elapsedTime + ', ' + classToAdd)
        .removeClass(classToRemove)
        .addClass(classToAdd);
    }

    TEST_DATA.test.push({
      dataName: dataName,
      refCentrality: refCentrality,
      colormap: colorMapName,
      span: span,
      elapsedTime: elapsedTime,
      isCorrect: isCorrect
    });
    console.log(TEST_DATA);
    userTest(testIdx + 1);
  }
}
