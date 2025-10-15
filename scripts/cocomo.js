// backend/cocomo.js

export function calculateCOCOMO({ kloc, mode, salary, factors }) {
  const modeCoefficients = {
    organico: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
    semiacoplado: { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
    empotrado: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 },
  };

  const costDrivers = {
    RELY: { 'Muy Bajo': 0.75, 'Bajo': 0.88, 'Nominal': 1.00, 'Alto': 1.15, 'Muy Alto': 1.40 },
    DATA: { 'Bajo': 0.94, 'Nominal': 1.00, 'Alto': 1.08, 'Muy Alto': 1.16 },
    CPLX: { 'Muy Bajo': 0.70, 'Bajo': 0.85, 'Nominal': 1.00, 'Alto': 1.15, 'Muy Alto': 1.30, 'Extra Alto': 1.65 },
    TIME: { 'Nominal': 1.00, 'Alto': 1.11, 'Muy Alto': 1.30, 'Extra Alto': 1.66 },
    STOR: { 'Nominal': 1.00, 'Alto': 1.06, 'Muy Alto': 1.21, 'Extra Alto': 1.56 },
    VIRT: { 'Muy Bajo': 0.87, 'Bajo': 0.94, 'Nominal': 1.00, 'Alto': 1.10, 'Muy Alto': 1.15 },
    TURN: { 'Bajo': 0.87, 'Nominal': 1.00, 'Alto': 1.07, 'Muy Alto': 1.15 },
    ACAP: { 'Muy Bajo': 1.46, 'Bajo': 1.19, 'Nominal': 1.00, 'Alto': 0.86, 'Muy Alto': 0.71 },
    AEXP: { 'Muy Bajo': 1.29, 'Bajo': 1.13, 'Nominal': 1.00, 'Alto': 0.91, 'Muy Alto': 0.82 },
    PCAP: { 'Muy Bajo': 1.42, 'Bajo': 1.17, 'Nominal': 1.00, 'Alto': 0.86, 'Muy Alto': 0.70 },
    PEXP: { 'Muy Bajo': 1.19, 'Bajo': 1.10, 'Nominal': 1.00, 'Alto': 0.90, 'Muy Alto': 0.85 },
    LTEX: { 'Muy Bajo': 1.14, 'Bajo': 1.07, 'Nominal': 1.00, 'Alto': 0.95, 'Muy Alto': 0.84 },
    MODP: { 'Muy Bajo': 1.24, 'Bajo': 1.10, 'Nominal': 1.00, 'Alto': 0.91, 'Muy Alto': 0.82 },
    TOOL: { 'Muy Bajo': 1.24, 'Bajo': 1.10, 'Nominal': 1.00, 'Alto': 0.91, 'Muy Alto': 0.83 },
    SCED: { 'Muy Bajo': 1.23, 'Bajo': 1.08, 'Nominal': 1.00, 'Alto': 1.04, 'Muy Alto': 1.10 },
  };

  const coeffs = modeCoefficients[mode];
  if (!coeffs) throw new Error('Modo inválido');

  let eaf = 1.0;
  const multipliers = {};

  for (const factor in factors) {
    const nivel = factors[factor];
    const mult = costDrivers[factor]?.[nivel] ?? 1.0;
    multipliers[factor] = mult;
    eaf *= mult;
  }

  const pmNominal = coeffs.a * Math.pow(kloc, coeffs.b);
  const pm = pmNominal * eaf;
  const duration = coeffs.c * Math.pow(pm, coeffs.d);
  const p = pm / duration;
  const c = p * salary;

  return {
  pmNominal: pmNominal.toFixed(2),
  eaf: eaf.toFixed(4),
  pm: pm.toFixed(2),
  duration: duration.toFixed(2),
  p: p.toFixed(2),
  c: c.toFixed(2),
  multipliers,
  coeffs
};
}