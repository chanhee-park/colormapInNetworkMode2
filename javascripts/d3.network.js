function drawGraph(dataName, refCentrality, colorMapName, span, testIdx) {
    const startTime = Util.getTime();
    const graph = Data.getData(dataName);
    const colorMap = Constant.colorMaps[colorMapName];

    let rotate = Math.random() * 360;
    let scale = 1;
    let moveX = (dataName === 'jazz') ? -25 : 0;
    let moveY = (dataName === 'jazz') ? -50 : 0;

    if (refCentrality === 'random') setRandCentrality();

    console.log(dataName, refCentrality, colorMapName, span);
    $('.task-desc').text((testIdx+1) + "/108: " + dataName + ", " + refCentrality + ", " +  colorMapName + ", " + span);
    $('.result-desc').text("");

    // Set Render Size
    const svgHTML = document.getElementById('network');
    const svg = d3.select("svg#network"),
        legendSvg = d3.select("svg#legend"),
        svgWidth = svgHTML.width.baseVal.value,
        svgHeight = svgHTML.height.baseVal.value,
        width = (dataName === 'jazz') ? svgHeight * 0.93 : svgHeight * 0.8,
        height = (dataName === 'jazz') ? svgHeight * 0.93 : svgHeight * 0.8;

    svg.selectAll("*").remove();
    legendSvg.selectAll("*").remove();

    // No Magic Number !
    const nodeRadius = (dataName === 'jazz') ? 3 : 5,
        linkColor = '#000',
        linkOpacity = 0.15,
        legendX = 25,
        legendY = 50,
        legendSize = 15;

    let maxAxisVal = undefined,
        minCentralityVal = undefined,
        maxCentralityVal = undefined;

    let sourceMin, sourceMax, target, correctNode = undefined;

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
    function drawColorLegend() {
        legendSvg.append('text')
            .text('low')
            .attrs({
                x: legendX,
                y: legendY - 5,
                'text-anchor': 'start',
                'alignment-baseline': 'ideographic'
            });
        legendSvg.append('text')
            .text('high')
            .attrs({
                x: legendX + 255 * 1.5,
                y: legendY - 5,
                'text-anchor': 'middle',
                'alignment-baseline': 'ideographic'
            });


        for (let i = 0; i <= 255; i++) {
            const relative = i / 255;
            const virtualCentrality = Util.getAbsoluteVal(relative, minCentralityVal, maxCentralityVal);
            const color = getHexColor(virtualCentrality);
            legendSvg.append('rect')
                .attrs({
                    x: legendX + i,
                    y: legendY,
                    width: 4,
                    height: legendSize,
                    fill: color,
                });
            if (i === 0 || i === 127 || i === 255) {
                legendSvg.append('text')
                    .text(virtualCentrality.toFixed(2))
                    .attrs({
                        x: legendX + i,
                        y: legendY + legendSize + 15,
                        'text-anchor': 'middle',
                        'alignment-baseline': 'central'
                    })
            }
        }
    }

    /**
     * Draw Nodes
     */
    function drawNodes() {
        _.forEach(graph.nodes, function (node) {
            drawNode(node);
        });
    }

    function drawNode(node, type) {
        const coord = getCoord({ x: node.x, y: node.y });
        let color = getHexColor(node[refCentrality]);

        let addedRadius = type !== undefined ? 1.5 : 0;
        let stroke = type === 'source' ? '#F00' : 'none';
        stroke = type === 'target' ? '#000' : stroke;

        svg.append('circle')
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
            .on('click', function () {
                if (type === 'source') {
                    checkAnswerResult(node);
                }
            });
    }

    function drawTargets() {
        const targetSet = getTargetSet(graph.nodes, refCentrality, span);
        const randTargetIdx = parseInt(Math.random() * targetSet.length);
        const targetNodesIdx = targetSet[randTargetIdx];

        const targetNodes = sortBy([
            graph.nodes[targetNodesIdx[0]],
            graph.nodes[targetNodesIdx[1]],
            graph.nodes[targetNodesIdx[2]]
        ], refCentrality);

        sourceMin = targetNodes[0];
        sourceMax = targetNodes[2];
        target = targetNodes[1];

        const minDiff = target[refCentrality] - sourceMin[refCentrality];
        const maxDiff = sourceMax[refCentrality] - target[refCentrality];
        correctNode = minDiff < maxDiff ? sourceMin : sourceMax;

        drawNode(sourceMin, 'source');
        drawNode(sourceMax, 'source');
        drawNode(target, 'target');
    }

    /**
     * Draw Links
     */
    function drawLinks() {
        _.forEach(graph.links, function (link) {
            const sourceNodeIdx = link.source;
            const targetNodeIdx = link.target;
            const sourceCoord = getCoord(graph.nodes[sourceNodeIdx]);
            const targetCoord = getCoord(graph.nodes[targetNodeIdx]);

            svg.append('line')
                .attrs({
                    x1: sourceCoord.x,
                    x2: targetCoord.x,
                    y1: sourceCoord.y,
                    y2: targetCoord.y,
                    stroke: linkColor,
                    opacity: (dataName === 'jazz') ? linkOpacity / 3 : linkOpacity
                })
        });
    }

    function transformDiagram() {
        d3.selectAll('circle')
            .attr('transform', `rotate(${rotate}, ${svgWidth / 2}, ${svgHeight / 2}) scale(${scale}, ${scale}) translate(${moveX}, ${moveY})`);

        d3.selectAll('line')
            .attr('transform', `rotate(${rotate}, ${svgWidth / 2}, ${svgHeight / 2}) scale(${scale}, ${scale}) translate(${moveX}, ${moveY})`);
    }

    /**
     * 'pos' is the coordinate with center point (0,0).
     * Returns the top-left point to be (0,0).
     * @param pos
     * @returns {{x: number, y: number}}
     */
    function getCoord(pos) {
        return {
            x: (svgWidth / 2) + (pos.x / maxAxisVal) * (width / 2),
            y: (svgHeight / 2) + (pos.y / maxAxisVal) * (height / 2)
        }
    }

    /**
     * Get Hexadecimal Color from centrality
     * @param centrality
     * @returns {string} : rgb({r}, {g}, {b})
     */

    function getHexColor(centrality) {
        const relativeVal = Util.getRelativeVal(centrality, minCentralityVal, maxCentralityVal);
        let nonZeroVal = relativeVal;
        if (colorMapName === 'single_blue') {
            nonZeroVal = (relativeVal + 0.2) / 1.2;
        } else if (colorMapName === 'rainbow') {
            nonZeroVal = (relativeVal + 0.3) / 1.3;
        }
        return colorMap(nonZeroVal);
    }

    function setRandCentrality() {
        _.forEach(graph.nodes, (node) => {
            node['random'] = Math.random();
        })
    }

    function checkAnswerResult(userAnswerNode) {
        const elapsedTime = Util.getTimeDiffFrom(startTime);
        const isCorrect = userAnswerNode === correctNode;
        console.log("result : ", elapsedTime, isCorrect);
        $('.result-desc').text("result: " + elapsedTime + ", " + isCorrect);
        TEST_RESULT.push({
            dataName: dataName,
            refCentrality: refCentrality, 
            colormap : colorMapName, 
            span : span,
            elapsedTime : elapsedTime, 
            isCorrect : isCorrect
        });
        userTest(testIdx+1);
    }
}
