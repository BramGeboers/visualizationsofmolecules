export const atomicRadii: { [key: string]: number } = {
    // Hydrogen to Argon
    H: 0.25, He: 0.31, Li: 1.52, Be: 1.12, B: 0.87, C: 0.77, N: 0.75, O: 0.73, F: 0.64, Ne: 0.38,
    Na: 1.54, Mg: 1.36, Al: 1.18, Si: 1.11, P: 1.07, S: 1.02, Cl: 0.99, Ar: 0.71,

    // Potassium to Krypton
    K: 2.03, Ca: 1.97, Sc: 1.60, Ti: 1.40, V: 1.35, Cr: 1.29, Mn: 1.39, Fe: 1.25, Co: 1.26, Ni: 1.21,
    Cu: 1.38, Zn: 1.31, Ga: 1.26, Ge: 1.22, As: 1.21, Se: 1.16, Br: 1.14, Kr: 0.88,

    // Rubidium to Radon
    Rb: 2.16, Sr: 1.91, Y: 1.62, Zr: 1.48, Nb: 1.37, Mo: 1.45, Tc: 1.56, Ru: 1.25, Rh: 1.25,
    Pd: 1.28, Ag: 1.44, Cd: 1.49, In: 1.63, Sn: 1.46, Sb: 1.46, Te: 1.47, I: 1.40, Xe: 1.08,

    // Cesium to Oganesson
    Cs: 2.35, Ba: 1.98, La: 1.69, Ce: 1.65, Pr: 1.65, Nd: 1.64, Pm: 1.63, Sm: 1.62, Eu: 1.85,
    Gd: 1.61, Tb: 1.59, Dy: 1.59, Ho: 1.58, Er: 1.57, Tm: 1.56, Yb: 1.94, Lu: 1.56,
    Hf: 1.44, Ta: 1.34, W: 1.30, Re: 1.28, Os: 1.26, Ir: 1.27, Pt: 1.30, Au: 1.34, Hg: 1.49,
    Tl: 1.48, Pb: 1.47, Bi: 1.46, Po: 1.40, At: 1.50, Rn: 1.50, Fr: 2.60, Ra: 2.21,
    Ac: 2.15, Th: 1.65, Pa: 1.61, U: 1.42, Np: 1.40, Pu: 1.39, Am: 1.38, Cm: 1.37,
    Bk: 1.37, Cf: 1.36, Es: 1.35, Fm: 1.35, Md: 1.34, No: 1.34, Lr: 1.33, Rf: 1.30,
    Db: 1.29, Sg: 1.28, Bh: 1.27, Hs: 1.26, Mt: 1.25, Ds: 1.24, Rg: 1.23, Cn: 1.22,
    Nh: 1.21, Fl: 1.20, Mc: 1.19, Lv: 1.18, Ts: 1.17, Og: 1.16
};

export const atomColors: { [key: string]: string } = {
    // Hydrogen to Argon
    H: "#FFFFFF", He: "#D9D9D9", Li: "#FFC0CB", Be: "#32CD32", B: "#A52A2A", C: "#808080",
    N: "#0000FF", O: "#FF0000", F: "#00FF00", Ne: "#ADD8E6",
    Na: "#800080", Mg: "#228B22", Al: "#C0C0C0", Si: "#D2B48C", P: "#FFA500", S: "#FFFF00",
    Cl: "#00FF7F", Ar: "#87CEEB",

    // Potassium to Krypton
    K: "#9370DB", Ca: "#FFD700", Sc: "#708090", Ti: "#4682B4", V: "#00008B", Cr: "#8B0000",
    Mn: "#CD853F", Fe: "#B22222", Co: "#4B0082", Ni: "#008080", Cu: "#B87333", Zn: "#ADFF2F",
    Ga: "#DDA0DD", Ge: "#F0E68C", As: "#BDB76B", Se: "#D2691E", Br: "#8B4513", Kr: "#5F9EA0",

    // Rubidium to Radon
    Rb: "#FF69B4", Sr: "#9400D3", Y: "#1E90FF", Zr: "#B0C4DE", Nb: "#FA8072", Mo: "#778899",
    Tc: "#FF4500", Ru: "#9932CC", Rh: "#DAA520", Pd: "#696969", Ag: "#DCDCDC", Cd: "#7B68EE",
    In: "#F08080", Sn: "#BC8F8F", Sb: "#8B4513", Te: "#2E8B57", I: "#4B0082", Xe: "#00BFFF",

    // Cesium to Oganesson
    Cs: "#FFDAB9", Ba: "#9ACD32", La: "#FFFACD", Ce: "#FFE4B5", Pr: "#FFD700", Nd: "#FF4500",
    Sm: "#ADFF2F", Eu: "#CD853F", Gd: "#8B4513", Tb: "#6B8E23", Dy: "#FF6347", Ho: "#FF00FF",
    Er: "#FFDAB9", Tm: "#DA70D6", Yb: "#FFE4E1", Lu: "#BC8F8F", Hf: "#A9A9A9", Ta: "#778899",
    W: "#2F4F4F", Re: "#696969", Os: "#708090", Ir: "#483D8B", Pt: "#7CFC00", Au: "#FFD700",
    Hg: "#00CED1", Tl: "#9400D3", Pb: "#4B0082", Bi: "#FF4500", Po: "#FFFF54", At: "#FF6347",
    Rn: "#00FF7F", Fr: "#FF1493", Ra: "#9ACD32", Ac: "#1E90FF", Th: "#FFA500", Pa: "#FF4500",
    U: "#FFD700", Np: "#FF4500", Pu: "#8B0000", Am: "#FF6347", Cm: "#00FFFF", Bk: "#8A2BE2",
    Cf: "#7FFF00", Es: "#FF4500", Fm: "#6A5ACD", Md: "#CD853F", No: "#FF00FF", Lr: "#FFE4B5",
    Rf: "#8B4513", Db: "#FF8C00", Sg: "#1E90FF", Bh: "#ADFF2F", Hs: "#CD5C5C", Mt: "#FFDAB9",
    Ds: "#7B68EE", Rg: "#DAA520", Cn: "#8B008B", Nh: "#D2691E", Fl: "#C71585", Mc: "#FF4500",
    Lv: "#FF7F50", Ts: "#98FB98", Og: "#ADD8E6"
};
