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

(function () {
    'use strict';

    let data = [];

    d3.json("/chart", function (error, chartData) {
        if (error) {
            throw error;
        }

        data = chartData;

        let colors = d3.schemeCategory10;

        let height = 400,
            outerScale = (height * 0.05),
            innerScale = (height * 0.025);

        let outerRadius = height / 2 - outerScale,
            innerRadius = outerRadius / 3 + innerScale,
            cornerRadius = 5;

// Define the div for the tooltip
        let tooltip = d3.select("body")
            .append("div")
            .attr("class", "chartTip")
            .style("opacity", 0);

// var pie = d3.layout.pie()
        let pie = d3.pie()
            .padAngle(.03)
            .sort((a, b) => {
                // Reverse
                return b.value - a.value;
            })
            .value(d => d.value);

        let arc = d3.arc()
            .padRadius(outerRadius)
            .cornerRadius(cornerRadius);

        let svg = d3.select("#goalsChart")
            .append("svg")
            .style("width", '100%')
            .attr("viewBox", "0 0 400 400")
            .attr("id", "svgChart");

        let g = svg.append("g")
            .attr("transform", "translate(" + height / 2 + "," + height / 2 + ")");

        svg.append("text")
            .attr('x', height / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .text('Goals');

        g.selectAll("path")
            .data(pie(data))
            .enter()
            .append("path")
            .each(function (d) {
                d.outerRadius = outerRadius - outerScale;
                d.innerRadius = innerRadius + innerScale;
            })
            .style('fill', (d, i) => colors[i])
            .attr("data-legend", d => d.data.label)
            .attr("data-legend-pos", (d, i) => data.length - i)
            .attr("d", arc)
            .on("mouseover touchstart", arcTween({
                outerRadius: outerRadius,
                innerRadius: innerRadius,
                delay: 0,
                duration: 250,
                ease: d3.easeElasticOut,
                toolTip: toolTipStart
            }))
            .on("mouseout touchend", arcTween({
                outerRadius: outerRadius - outerScale,
                innerRadius: innerRadius + innerScale,
                delay: 150,
                duration: 500,
                ease: d3.easeBounceOut,
                toolTip: toolTipEnd
            }))
            .on('mousemove touchmove', toolTipMove);

        // Add a legend when printed.
        window.addEventListener("beforeprint", () => {
            let svgLegend = d3.select("#goalsChart")
                .append("svg")
                .attr("id", "goalsChartLegend")
                .attr("viewBox", "0 0 400 150")
                .style("height", '150px')
                .style("width", '100%');

            let legend = svgLegend.append("g")
                .attr("class", "legend")
                .attr("data-source", "#svgChart")
                .call(d3.legend);

            setTimeout(function () {
                legend
                    .attr("data-style-padding", 10)
                    .call(d3.legend)
            }, 0);
        });

        // Remove the legend after printing.
        window.addEventListener("afterprint", () => {
            d3.select("#goalsChartLegend").remove();
        });

        function arcTween(options) {
            return function (d) {
                d3.event.preventDefault();
                d3.event.stopPropagation();
                d3.select(this)
                    .transition()
                    .delay(options.delay)
                    .duration(options.duration)
                    .ease(options.ease)
                    .attrTween("d", function (d) {
                        let i = d3.interpolate(d.outerRadius, options.outerRadius);
                        let j = d3.interpolate(d.innerRadius, options.innerRadius);
                        return function (t) {
                            d.outerRadius = i(t);
                            d.innerRadius = j(t);
                            return arc(d);
                        };
                    });
                options.toolTip(d);
            };
        }

        function toolTipStart(d) {
            let halfWay = (window.innerWidth / 2),
                event = d3.event.touches ? d3.event.touches[0] : d3.event,
                tooltipBox;

            // Fill in the tooltip to fix its size
            tooltip
                .html('<strong>' + d.data.label + '</strong>');

            // Position the tooltip box
            tooltipBox = tooltip.node().getBoundingClientRect();
            tooltip
                .style('top', `${(event.pageY - tooltipBox.height - 15)}px`)
                .style('left', `${(event.pageX > halfWay ? event.pageX - Math.min(halfWay, 250) : event.pageX)}px`);

            // Show the tooltip
            tooltip
                .transition()
                .duration(200)
                .style('opacity', .9);
        }

        function toolTipMove() {
            let halfWay = (window.innerWidth / 2),
                event = d3.event.touches ? d3.event.touches[0] : d3.event,
                tooltipBox = tooltip.node().getBoundingClientRect();
            d3.event.preventDefault();
            d3.event.stopPropagation();
            tooltip
                .style('top', `${(event.pageY - tooltipBox.height - 15)}px`)
                .style('left', `${(event.pageX > halfWay ? event.pageX - Math.min(halfWay, 250) : event.pageX)}px`);
        }

        function toolTipEnd() {
            tooltip
                .transition()
                .duration(500)
                .style('opacity', 0);
        }

    });
})();
