// src/utils/papelRasgado.ts
// Borde de papel rasgado para las secciones blancas (arriba y abajo).
// Una sola definición: Padres y Fecha la usan, así se ajusta en un lugar.
//
// Devuelve un clip-path polygon: x en %, y en px. Mezcla lomas suaves con
// ruido fino para que parezca rasgado a mano. Es siempre el mismo dibujo
// para una misma semilla, así el servidor y el navegador no discrepan.

function ruido(semilla: number) {
    let s = semilla;
    return () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
    };
}

function borde(semilla: number) {
    const azar = ruido(semilla);
    const puntos: { x: number; y: number }[] = [];
    // Lomas grandes (como montañas suaves) + dientes finos encima
    let fino = 0;
    for (let x = 0; x <= 100.001; x += 1.1) {
        const lomas =
            Math.sin(x * 0.15 + semilla) * 3.8 + Math.sin(x * 0.29 + 2.1) * 1.6;
        fino = fino * 0.55 + (azar() - 0.5) * 2.7;
        const y = 12 + lomas + fino + azar() * 2;
        puntos.push({ x: Math.min(x, 100), y: Math.max(2, y) });
    }
    return puntos;
}

// semillaArriba y semillaAbajo distintas: cada borde sale diferente
export function papelRasgado(semillaArriba: number, semillaAbajo: number) {
    const arriba = borde(semillaArriba).map(
        (p) => `${p.x.toFixed(1)}% ${p.y.toFixed(1)}px`,
    );
    const abajo = borde(semillaAbajo)
        .reverse()
        .map((p) => `${p.x.toFixed(1)}% calc(100% - ${p.y.toFixed(1)}px)`);
    return `polygon(${[...arriba, ...abajo].join(", ")})`;
}
