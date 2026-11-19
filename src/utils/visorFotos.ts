// src/utils/visorFotos.ts
// Al tocar una foto (instantánea .polaroid) se abre en grande, sobre un fondo
// oscuro. Se cierra tocando en cualquier lado, con la X o con Escape.
// Una sola definición para todas las fotos de la invitación.
//
// La versión grande de cada foto vive en /imagenes/grandes/ con el mismo
// nombre; si no existe, se usa la misma imagen de la tarjeta.
import { gsap } from "gsap";

export function iniciarVisorFotos() {
    const visor = document.getElementById("visor-fotos");
    const imagen = document.getElementById("visor-imagen") as HTMLImageElement | null;
    const cerrar = document.getElementById("visor-cerrar");
    if (!visor || !imagen || !cerrar) return;

    const menosMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    let abierto = false;
    let overflowAntes = "";
    let enfocadoAntes: Element | null = null;

    const abrir = (foto: HTMLImageElement) => {
        if (abierto) return;
        abierto = true;
        enfocadoAntes = document.activeElement;

        const chica = foto.currentSrc || foto.src;
        const grande = new URL(foto.getAttribute("src") ?? chica, location.href)
            .pathname.replace("/imagenes/", "/imagenes/grandes/");
        imagen.alt = foto.alt;
        imagen.src = chica;
        // Se muestra la chica al instante y se cambia por la grande al cargar
        const alta = new Image();
        alta.onload = () => {
            if (abierto) imagen.src = grande;
        };
        alta.src = grande;

        overflowAntes = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        visor.hidden = false;
        cerrar.focus({ preventScroll: true });

        if (menosMovimiento) {
            gsap.set([visor, imagen], { opacity: 1, scale: 1 });
            return;
        }
        gsap.fromTo(visor, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(
            imagen,
            { opacity: 0, scale: 0.85, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out" },
        );
    };

    const cerrarVisor = () => {
        if (!abierto) return;
        abierto = false;
        const terminar = () => {
            visor.hidden = true;
            imagen.removeAttribute("src");
            document.body.style.overflow = overflowAntes;
            (enfocadoAntes as HTMLElement | null)?.focus?.({ preventScroll: true });
        };
        if (menosMovimiento) return terminar();
        gsap.to(imagen, { opacity: 0, scale: 0.9, duration: 0.25, ease: "power2.in" });
        gsap.to(visor, { opacity: 0, duration: 0.3, onComplete: terminar });
    };

    document.addEventListener("click", (e) => {
        const objetivo = e.target as Element | null;
        const foto = objetivo?.closest?.(".polaroid img") as HTMLImageElement | null;
        // El marco con el birrete (sin foto) no se agranda
        if (!foto || foto.closest(".vacia")) return;
        abrir(foto);
    });

    visor.addEventListener("click", cerrarVisor);
    cerrar.addEventListener("click", (e) => {
        e.stopPropagation();
        cerrarVisor();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") cerrarVisor();
    });
}
