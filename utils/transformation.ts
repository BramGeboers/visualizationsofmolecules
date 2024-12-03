export function invert(z: { x: number; y: number; z: number }, P: { x: number; y: number; z: number }) {
    const dx = z.x - P.x;
    const dy = z.y - P.y;
    const dz = z.z - P.z;
    const denominator = dx ** 2 + dy ** 2 + dz ** 2;
    return {
      x: dx / denominator + P.x,
      y: dy / denominator + P.y,
      z: dz / denominator + P.z,
    };
  }
  
  export function scale(z: { x: number; y: number; z: number }, L: number) {
    return {
      x: L * z.x,
      y: L * z.y,
      z: L * z.z, // Apply scaling to the z-axis as well
    };
  }
  
  export function mobiusScalingTransform(
    z: { x: number; y: number; z: number },
    P: { x: number; y: number; z: number },
    L: number
  ) {
    const firstInversion = invert(z, P);
    const scaled = scale(firstInversion, Math.pow(2, L)); // Scaling with 2^L
    return invert(scaled, P);
  }
  