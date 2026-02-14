
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SystemStatus } from '../types';

interface JarvisHUDProps {
  status: SystemStatus;
}

const JarvisHUD: React.FC<JarvisHUDProps> = ({ status }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;
    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

    // Colors based on status
    const mainColor = status === SystemStatus.ERROR ? "#ff0055" : 
                    status === SystemStatus.LISTENING ? "#00f2ff" : 
                    status === SystemStatus.PROCESSING ? "#a100ff" : 
                    "#00f2ff";

    // Static decorative rings
    g.append("circle")
      .attr("r", radius - 20)
      .attr("fill", "none")
      .attr("stroke", mainColor)
      .attr("stroke-width", 1)
      .attr("opacity", 0.3);

    // Rotating Arcs
    const arcData = [
      { rInner: radius - 40, rOuter: radius - 35, start: 0, end: 1.5, speed: 0.02 },
      { rInner: radius - 55, rOuter: radius - 50, start: 2, end: 4, speed: -0.015 },
      { rInner: radius - 70, rOuter: radius - 60, start: 0.5, end: 2.5, speed: 0.03 },
    ];

    const arcs = g.selectAll(".hud-arc")
      .data(arcData)
      .enter()
      .append("path")
      .attr("class", "hud-arc")
      .attr("fill", mainColor)
      .attr("opacity", 0.6);

    const arcGen = d3.arc<any>();

    // Animation loop
    let angle = 0;
    const timer = d3.timer(() => {
      angle += 0.01;
      
      // Fix: Wrapped parameter 'd' in parentheses to correctly define the arrow function and fix name resolution.
      arcs.attr("d", (d: any) => {
        const currentAngle = angle * (d.speed > 0 ? 1 : -1) * Math.abs(d.speed * 100);
        return arcGen({
          innerRadius: d.rInner,
          outerRadius: d.rOuter,
          startAngle: d.start + currentAngle,
          endAngle: d.end + currentAngle
        });
      });

      // Pulse the center if listening
      if (status === SystemStatus.LISTENING) {
        centerCircle.attr("r", 30 + Math.sin(angle * 5) * 10);
      } else {
        centerCircle.attr("r", 30);
      }
    });

    const centerCircle = g.append("circle")
      .attr("r", 30)
      .attr("fill", "none")
      .attr("stroke", mainColor)
      .attr("stroke-width", 2)
      .attr("class", "center-core");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("fill", mainColor)
      .attr("class", "font-orbitron text-xs font-bold")
      .text(status);

    return () => timer.stop();
  }, [status]);

  return (
    <div className="relative w-full flex justify-center items-center py-8">
      <svg ref={svgRef} width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-[0_0_15px_rgba(0,242,255,0.4)]" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-80 h-80 rounded-full border border-cyan-500/20 animate-pulse`}></div>
      </div>
    </div>
  );
};

export default JarvisHUD;
