Voy a corregir estos puntos concretos:

1. Frames de la chica
- El problema está claro: el código busca `/frames/chica/hero-girlrt_0001.jpg`, pero los archivos reales se llaman `hero-girlrt__0001.jpg` con doble guion bajo.
- Cambiaré el prefijo para que apunte exactamente a los archivos reales y cargue la secuencia completa.

2. Logo más al fondo
- Ajustaré la visualización del canvas del logo para que no llene tanto la pantalla.
- Haré que el logo se vea más pequeño/profundo, manteniendo el detalle visible y sin tocar la secuencia de archivos.

3. Galería de tatuajes
- Confirmé que sí hay 5 imágenes en `src/assets/trabajos`: `trabajo1.png` a `trabajo5.png`.
- Cambiaré la experiencia al entrar en “Tatuajes”: en vez de abrir directamente una imagen ampliada, abrirá una galería propia tipo móvil con miniaturas en grid/stack.
- Dentro de esa galería habrá scroll interno propio.
- El scroll de la página principal quedará bloqueado mientras la galería esté abierta.
- Al tocar una miniatura, recién ahí se abrirá la imagen ampliada.

4. Botón X siempre funcional
- La X de cerrar estará fija dentro de la galería desde el primer momento.
- Le daré z-index superior al nav para que “Reservar cita” y hamburguesa nunca la bloqueen.
- La X cerrará la galería aunque estés arriba, abajo o con scroll interno.

5. Texto “Bienvenido / NIÑO TATTOO”
- Cambiaré solo esa tarjeta de biografía para que “Bienvenido” y “NIÑO TATTOO” usen blanco marfil en vez de dorado.
- No tocaré el resto del diseño.

Archivos a tocar:
- `src/routes/index.tsx`
- `src/components/nino/MediaGrid.tsx`
- `src/components/nino/Lightbox.tsx`
- posiblemente `src/components/nino/FrameCanvas.tsx` si hace falta soporte limpio para encajar el logo más pequeño.