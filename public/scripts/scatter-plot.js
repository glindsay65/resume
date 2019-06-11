/* public/scripts/chart.js

	Copyright 2017 Fast Dog Coding, LLC

	Licensed under the Apache License, Version 2.0 (the "License"); you may not
	use this file except in compliance with the License. You may obtain a copy
	of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
	WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
	License for the specific language governing permissions and limitations
	under the License.
 */

function ScatterPlot(source, target) {
  this.targetNode = target;
  this.svg = null;
  this.margin = null;
  this.width = null;
  this.height = null;
  this.domainWidth = null;
  this.domainHeight = null;
  this.skills = null;
  this.chartBody = null;
  this.xAxis = null;
  this.yAxis = null;
  this.xScale = null;
  this.yScale = null;
  this.xLabels = null;
  this.yLabels = null;

  this.init = (error, data) => {
    if (error) {
      throw error;
    }

    this.margin = {top: 10, right: 10, bottom: 60, left: 90};
    this.skills = data; // data.skills;

    // Initialize scales
    this.xScale = d3.scaleLinear().domain([0, 100]);
    this.yScale = d3.scaleLinear().domain([0, 100]);
    this.xLabels = d3.scaleQuantize()
        .domain([0, 100])
        .range(['years ago', 'months ago', 'now']);
    this.yLabels = d3.scaleQuantize()
        .domain([0, 100])
        .range(['learning', 'functional', 'can teach']);

    // Initialize axis
    this.xAxis = d3.axisBottom();
    this.yAxis = d3.axisLeft();

    // Initialize svg
    this.svg = d3.select(this.targetNode)
        .append("svg");
    this.chartBody = this.svg.append("g")
        .attr("class", "chart-body");
    this.chartBody.append("rect")
        .attr("fill", "#F9F9F9");

    // X Axis
    this.chartBody.append("g")
        .attr("class", "x-axis");
    this.chartBody.append("line")
        .attr("class", "x-grid-line")
        .attr('fill', 'none')
        .attr('shape-rendering', 'crispEdges')
        .attr('stroke', 'grey')
        .attr('stroke-width', '1px');
    this.chartBody.append("text")
        .attr("class", "x-axis-label")
        .style("text-anchor", "middle")
        .text("last used");

    // Y Axis
    this.chartBody.append("g")
        .attr("class", "y-axis");
    this.chartBody.append("line")
        .attr("class", "y-grid-line")
        .attr('fill', 'none')
        .attr('shape-rendering', 'crispEdges')
        .attr('stroke', 'grey')
        .attr('stroke-width', '1px');
    this.chartBody.append("text")
        .attr("class", "y-axis-label")
        .style("text-anchor", "middle")
        .text("proficiency");

    // Data
    // Place the data points and labels
    var node = this.chartBody.selectAll("g.dot")
        .data(this.skills)
        .enter()
        .append("g")
        .attr("class", "dot");

    node.append("circle")
        .attr("r", 4)
        .style("fill", "#60B19C");

    node.append("text")
        .attr("text-anchor", d => d.lastUsed > ScatterPlot.LABEL_ALIGN_THRESHOLD ? 'end' : 'start')
        .text(d => d.name);

    this.render();
  }

  this.render = () => {
    // get dimensions based on parent's width
    const parentRect = this.svg.node().parentNode.getBoundingClientRect();
    this.updateDimensions(parentRect.width /* - parentRect.left */);

    // update x and y scales to new dimensions
    this.xScale.range([0, this.domainWidth]);
    this.yScale.range([this.domainHeight, 0]);

    // update svg elements to new dimensions
    this.svg
        .attr('width', this.width)
        .attr('height', this.height);

    // update the axis and line
    this.xAxis.scale(this.xScale);
    this.yAxis.scale(this.yScale);

    // draw chart
    this.chartBody.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.chartBody.select("rect")
        .attr("width", this.domainWidth)
        .attr("height", this.domainHeight);

    // X Axis
    this.chartBody.select("g.x-axis")
        .attr("width", this.domainWidth)
        .attr("transform", "translate(0," + (this.yScale.range()[0] + 5) + ")")
        .call(this.xAxis.ticks(2).tickFormat(this.xLabels));

    this.chartBody.select("text.x-axis-label")
        .attr("y", (this.height))
        .attr("x", (this.domainWidth / 2))
        .attr("dy", "-1em");

    this.chartBody.select("line.x-grid-line")
        .attr('x1', this.xScale(50))
        .attr('y1', 0)
        .attr('x2', this.xScale(50))
        .attr('y2', this.domainHeight);

    // Y Axis
    this.chartBody.select("g.y-axis")
        .attr("height", this.domainHeight)
        .attr("transform", "translate(" + (-5) + ", 0)")
        .call(this.yAxis.ticks(2).tickFormat(this.yLabels));

    this.chartBody.select("text.y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -this.margin.left)
        .attr("x", -(this.domainHeight / 2))
        .attr("dy", "1em");

    this.chartBody.select("line.y-grid-line")
        .attr('x1', 0)
        .attr('y1', this.yScale(50))
        .attr('x2', this.domainWidth)
        .attr('y2', this.yScale(50));

    // Place the data points and labels
    var node = this.chartBody.selectAll("g.dot");

    node.select("circle")
        .attr("cx", d => this.xScale(d.lastUsed))
        .attr("cy", d => this.yScale(d.proficiency));

    node.select("text")
        .attr("x", d => this.xScale(d.lastUsed) + (d.lastUsed > ScatterPlot.LABEL_ALIGN_THRESHOLD ? -6.25 : 6.25))
        .attr("y", d => this.yScale(d.proficiency) + 4.50);
  };

  this.updateDimensions = (winWidth) => {
    this.width = winWidth;
    this.height = winWidth * 1.0;
    this.domainWidth = this.width - this.margin.left - this.margin.right;
    this.domainHeight = this.height - this.margin.top - this.margin.bottom;
  };

  d3.json(source, this.init.bind(this));

}

ScatterPlot.LABEL_ALIGN_THRESHOLD = 70;

const codingPlot = new ScatterPlot("/data/skillCategory-coding","#scatter-coding");
window.addEventListener('resize', codingPlot.render.bind(codingPlot));

const codingPlatforms = new ScatterPlot("/data/skillCategory-platforms","#scatter-platforms");
window.addEventListener('resize', codingPlatforms.render.bind(codingPlatforms));

const codingTools = new ScatterPlot("/data/skillCategory-tools","#scatter-tools");
window.addEventListener('resize', codingTools.render.bind(codingTools));
