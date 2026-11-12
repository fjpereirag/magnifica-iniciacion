# Una magnífica humanidad · Para empezar

Versión de iniciación de *Magnifica humanitas* (León XIV, 15 de mayo de 2026): la encíclica en siete pasos sencillos, para cualquier persona y para compartir por WhatsApp.

Cada paso tiene: «En pocas palabras», una explicación breve, una frase literal de la encíclica (comprobada con el texto oficial), un texto bíblico, una pregunta para la oración, un gesto para la vida. Al final, un único enlace lleva a la guía completa *Babel o Jerusalén* para leerla con calma.

| Paso | Parte | nn. | Encíclica | Escritura |
|---|---|---|---|---|
| 1 | Introducción · Babel o Jerusalén | 1-16 | n. 9 | Neh 2, 18 |
| 2 | Cap. I · Un camino largo | 17-45 | n. 27 | Mt 13, 52 |
| 3 | Cap. II · Los cimientos | 46-89 | n. 52 | Gn 1, 27 |
| 4 | Cap. III · La inteligencia artificial | 90-130 | n. 107 | Sal 8, 5 |
| 5 | Cap. IV · Verdad, trabajo, libertad | 131-181 | n. 170 | Jn 8, 32 |
| 6 | Cap. V · La paz | 182-228 | n. 214 | Rom 12, 21 |
| 7 | Conclusión · Con María | 229-245 | n. 245 | Lc 1, 46-47 |

Al final: «Palabras para entender» (glosario) y el enlace a la guía completa.

## Escena 3D
Frente a la torre de Babel, la muralla de Jerusalén se levanta un tramo con cada paso. El camino de luz (paso 2), la piedra angular (3), la torre de circuitos que brilla (4), las tres puertas (5), las luces rojas que dejan paso a las palomas (6) y la ciudad iluminada con los hilos de esperanza (7).

## Publicar en GitHub Pages
Crea el repositorio `magnifica-iniciacion` en la misma cuenta que `babel-jerusalen`, sube el contenido a la raíz y activa *Settings → Pages → main / (root)*. El enlace final usa la ruta relativa `../babel-jerusalen/`; si la guía completa está en otra dirección, cambia `DEEP` en el generador o busca y reemplaza `../babel-jerusalen/` en `index.html`.

## Técnica
HTML + CSS + JS sin compilación; Three.js r160 incluido en `js/`. Sin WebGL se muestra un dibujo SVG. Respeta `prefers-reduced-motion`. Variante clara «amanecer»: fondo pergamino, texto oscuro y oro viejo.
