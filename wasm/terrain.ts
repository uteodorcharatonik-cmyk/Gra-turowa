// AssemblyScript: numeric terrain kernel; no browser or JavaScript imports.
export function terrain_height(x: f64, z: f64, n: f64): f64 {
 const base=.035*Math.sin(x*.47+1.2)*Math.cos(z*.39-.6)+.018*Math.sin((x-z)*.72);
 const outside=Math.max(0,Math.max(Math.abs(x),Math.abs(z))-n/2-2);
 const blend=Math.min(1,outside/14),smooth=blend*blend*(3-2*blend);
 const hills=2.5+2*Math.sin(x*.09+.6)*Math.cos(z*.08);
 const wave=Math.abs(Math.sin(x*.045+z*.038)),ridge=wave*wave*wave;
 const mountains=14*ridge+3*Math.sin(z*.16)*Math.sin(x*.12);
 return base+smooth*(hills+Math.min(1,outside/32)*mountains);
}
// Reused buffer: rebuilding a map does not allocate more WASM memory.
const heights = new StaticArray<f64>(257*257);
export function terrain_grid(n: f64, size: f64, segments: i32): usize {
 if(segments<1||segments>256)return 0;
 const stride=segments+1;
 for(let row=0;row<=segments;row++)for(let col=0;col<=segments;col++){
  // Three.js PlaneGeometry uses float32 vertex coordinates before rotation.
  const x:f64=<f32>(col*size/segments-size/2);
  const z:f64=<f32>(row*size/segments-size/2);
  unchecked(heights[row*stride+col]=terrain_height(x,z,n));
 }
 return changetype<usize>(heights);
}
