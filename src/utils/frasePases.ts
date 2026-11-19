// src/utils/frasePases.ts
// La frase que depende de la cantidad de pases, en un solo lugar.
// Si hay que cambiar la redacción, se cambia acá y no en cada componente.
export function frasePases(pases: number): string {
    if (!pases || pases < 1) return "";
    return pases === 1
        ? "Tienes 1 pase reservado para ti"
        : `Tienes ${pases} pases reservados para ti`;
}
