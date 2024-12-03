// parseSDF.ts
export interface Atom {
  x: number;
  y: number;
  z: number;
  symbol: string;
}

export interface Bond {
  type: number; // 1: single, 2: double, 3: triple, 4: aromatic, etc.
  startAtomIndex: number;
  endAtomIndex: number;
}

export function parseSDF(data: string): { atoms: Atom[]; bonds: Bond[] } {
  const lines = data.split('\n');
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  let atomCount = 0;
  let bondCount = 0;
  let atomSection = false;
  let bondSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (i === 3) {
      // Line 4 contains atom and bond counts (e.g., "  16 15  0  0  0  0")
      atomCount = parseInt(line.slice(0, 3).trim(), 10);
      bondCount = parseInt(line.slice(3, 6).trim(), 10);
      atomSection = true;
      continue;
    }

    if (atomSection && atomCount > 0) {
      const [x, y, z, symbol] = line.trim().split(/\s+/);
      atoms.push({ x: parseFloat(x), y: parseFloat(y), z: parseFloat(z), symbol });
      atomCount--;
      if (atomCount === 0) bondSection = true;
      continue;
    }

    if (bondSection && bondCount > 0) {
      // SDF bond lines typically have the following format:
      // atom1_index atom2_index bond_type
      const startAtomIndex = parseInt(line.slice(0, 3).trim(), 10) - 1; // 1-indexed to 0-indexed
      const endAtomIndex = parseInt(line.slice(3, 6).trim(), 10) - 1;
      const bondType = parseInt(line.slice(6, 9).trim(), 10); // Bond type is typically in this position

      // Add bond to the list, including the bond type
      bonds.push({
        startAtomIndex,
        endAtomIndex,
        type: bondType, // Store bond type (1 for single, 2 for double, 3 for triple, 4 for aromatic, etc.)
      });

      bondCount--;
    }
  }

  return { atoms, bonds };
}