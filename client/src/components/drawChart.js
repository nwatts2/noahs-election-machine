import * as d3 from "d3";

function drawChart (element, data) {
  const colors = ["rgba(0, 71, 255, 1)", "rgba(36, 36, 37, .95)", 'rgb(253, 3, 83)'];
  const boxSize = 500;

  let winFill = 'transparent', winStroke = 'transparent', winText = '';

  for (let x of data) {
    if (x.value >= 218) {
      winStroke = 'white';
      if (x.party === 'DEMS') {winFill = "rgba(0, 71, 255, 1)"; winText = `DEMS`}
      else if (x.party === 'GOP') {winFill = "rgb(253, 3, 83)"; winText = `GOP`}
    }
}

  d3.select(element).select("svg").remove(); // Remove the old svg
  // Create new svg
  const svg = d3
    .select(element)
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("viewBox", `0 0 ${boxSize + 10} ${boxSize + 10}`)
    .append("g")
    .attr("transform", `translate(${(boxSize + 10) / 2}, ${(boxSize + 10) / 2})`);

  const arcGenerator = d3.arc().cornerRadius(10).padAngle(0.05).innerRadius(100).outerRadius(250);

  const pieGenerator = d3.pie().startAngle(-0.75 * Math.PI).value((d) => d.value);

  const arcs = svg.selectAll().data(pieGenerator(data)).enter();
  arcs
    .append("path")
    .attr("d", arcGenerator)
    .style("fill", (d, i) => colors[i % data.length])
    .transition()
    .duration(400)
    .attrTween('d', function (d) {
      const i = d3.interpolate(d.startAngle, d.endAngle);
      return function (t) {
        d.endAngle = i(t);
        return arcGenerator(d);
      }
    });
  
  arcs
    .append("text")
    .attr("text-anchor", 'middle')
    .text((d) => d.data.value < 40 ? '' : d.data.party === 'DEMS' || d.data.party === 'GOP' ? `${d.data.party}` : '')
    .style('fill', 'white')
    .style('font-size', '2.7rem')
    .style('font-family', 'Courier New')
    .style('font-weight', 'bold')
    .attr('transform', (d) => {
      const [x, y] = arcGenerator.centroid(d);
      return `translate(${x}, ${y})`;
    })
    .style("font-size", 0)
    .transition()
    .duration(400)
    .style('font-size', '2.7rem');

    svg
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 100)
      .attr('stroke', winStroke)
      .attr('fill', winFill)
      .transition()
      .duration(400)
      .attr('stroke-width', 8);
    
  svg
    .append("text")
    .attr("text-anchor", 'middle')
    .attr('y', -5)
    .text(winText)
    .style('fill', 'white')
    .style('font-family', 'Courier New')
    .style('font-weight', 'bold')
    .style("font-size", 0)
    .transition()
    .duration(400)
    .style('font-size', '3.7rem');
  
    svg
    .append("text")
    .attr("text-anchor", 'middle')
    .attr("y", 50)
    .text(winText === '' ? '' : (winText === 'DEMS' ? 'WIN' : 'WINS'))
    .style('fill', 'white')
    .style('font-family', 'Courier New')
    .style('font-weight', 'bold')
    .style("font-size", 0)
    .transition()
    .duration(400)
    .style('font-size', '3.7rem');
};

export default drawChart;