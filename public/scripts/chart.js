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

	console.log(d3.version);
	console.log('Here');

// var data = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

	let data = [{
		label: "to discover where the dryer sends socks",
		value: 4
	}, {
		label: "to use my skills to build cool solutions",
		value: 24
	}, {
		label: "to feed my desire to develop professionally",
		value: 24
	}, {
		label: "to support effective leadership",
		value: 24
	}, {
		label: "to blend with a team of professionals",
		value: 24
	}];

	let colors = d3.schemeCategory10;

	let height     = 400,
	    outerScale = (height * 0.05),
	    innerScale = (height * 0.025);

	let outerRadius  = height / 2 - outerScale,
	    innerRadius  = outerRadius / 3 + innerScale,
	    cornerRadius = 5;

// Define the div for the tooltip
	let tooltip = d3.select("body")
		.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

// var pie = d3.layout.pie()
	let pie = d3.pie()
		.padAngle(.03)
		//  .sort(function(a, b) { return a.label.localeCompare(b.label); })
		.sort((a, b) => {
			// Reverse
			return b.value - a.value;
		})
		.value(d => d.value);

	let arc = d3.arc()
		.padRadius(outerRadius)
		.cornerRadius(cornerRadius);

	let svg = d3.select("#goalsChart")
		.append("svg");

	let g = svg.style("width", '100%')
		.attr("height", height)
		.append("g")
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
		.attr("d", arc)
		.on("mouseover", arcTween({
			outerRadius: outerRadius,
			innerRadius: innerRadius,
			delay: 0,
			duration: 250,
			ease: d3.easeElasticOut,
			toolTip: d => {
				tooltip.transition()
					.duration(200)
					.style('opacity', .9);
				tooltip.html('<strong>' + d.data.label + '</strong>')
					.style('left', (d3.event.pageX) + 'px')
					.style('top', (d3.event.pageY - 28) + 'px');
			}
		}))
		.on("mouseout", arcTween({
			outerRadius: outerRadius - outerScale,
			innerRadius: innerRadius + innerScale,
			delay: 150,
			duration: 500,
			ease: d3.easeBounceOut,
			toolTip: d => {
				tooltip.transition()
					.duration(500)
					.style('opacity', 0);
			}
		}))
		.on('mousemove', d => {
			tooltip.style('top', (d3.event.pageY + 15) + 'px')
				.style('left', (d3.event.pageX + 15) + 'px');
		});

	function arcTween(options) {
		return function (d, i) {
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

})();
