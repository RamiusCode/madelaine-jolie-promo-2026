// src/utils/entradas.ts
// Animaciones de entrada al hacer scroll, en un solo lugar: todos los
// componentes la usan, así el movimiento y el ritmo se ajustan acá.
//
// Cada elemento arranca escondido y entra cuando se asoma en pantalla. Si la
// invitación tiene portada, nada entra hasta que se abre el sobre. Con
// "reducir movimiento" activado en el celular, no se anima nada.
import { gsap } from "gsap";

export type Entrada = "izquierda" | "derecha" | "abajo" | "zoom";

// Desde dónde parte cada una. Las que mueven en x o y no tocan la
// inclinación (rotate) que ya tengan por CSS, como las instantáneas.
const desde: Record<Entrada, gsap.TweenVars> = {
    izquierda: { x: -70, opacity: 0 },
    derecha: { x: 70, opacity: 0 },
    abajo: { y: 40, opacity: 0 },
    zoom: { scale: 0.9, y: 18, opacity: 0 },
};

const hasta: Record<Entrada, gsap.TweenVars> = {
    izquierda: { x: 0, opacity: 1 },
    derecha: { x: 0, opacity: 1 },
    abajo: { y: 0, opacity: 1 },
    zoom: { scale: 1, y: 0, opacity: 1 },
};

interface Opciones {
    retraso?: number; // segundos
    duracion?: number;
}

export function entrarAlHacerScroll(
    el: Element | null,
    tipo: Entrada,
    { retraso = 0, duracion = 1.4 }: Opciones = {},
) {
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(el, desde[tipo]);

    const obs = new IntersectionObserver(
        (entradas) => {
            if (!entradas.some((e) => e.isIntersecting)) return;
            obs.disconnect();
            gsap.to(el, {
                ...hasta[tipo],
                duration: duracion,
                delay: retraso,
                ease: "power3.out",
            });
        },
        { threshold: 0.2 },
    );

    // Con portada, recién se observa cuando se abre el sobre
    const observar = () => obs.observe(el);
    if (
        (window as any).portadaAbierta ||
        !document.getElementById("portada-section")
    ) {
        observar();
    } else {
        window.addEventListener("portada-abierta", observar, { once: true });
    }
}
