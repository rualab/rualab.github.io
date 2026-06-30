# Ruâ — Estudio de Arte y Diseño

Portfolio web con layout de dos columnas con scroll independiente.

## Archivos

```
rua-studio/
├── index.html   ← estructura y contenido
├── style.css    ← diseño y layout
├── main.js      ← interacciones (cambio de paneles, teclado)
└── README.md    ← este archivo
```

## Cómo verlo localmente

No necesitas Node ni nada instalado. Solo abres `index.html` en tu navegador.

Si quieres un servidor local (recomendado para evitar problemas con rutas de imágenes), tienes dos opciones:

**Opción A — VS Code (la más fácil):**
1. Instala la extensión "Live Server" en VS Code
2. Click derecho en `index.html` → "Open with Live Server"

**Opción B — Python (si ya lo tienes):**
```bash
cd rua-studio
python3 -m http.server 8000
# Abre http://localhost:8000 en tu navegador
```

## Cómo agregar un proyecto

1. En `index.html`, añade un `<li>` en la lista `.project-nav`:
```html
<li>
  <button class="project-btn" data-project="mi-proyecto">
    <span class="proj-index">06</span>
    <span class="proj-info">
      <span class="proj-name">Nombre del proyecto</span>
      <span class="proj-meta">Tipo — Año</span>
    </span>
  </button>
</li>
```

2. Añade el panel correspondiente dentro de `.col-right`:
```html
<div class="project-panel" data-panel="mi-proyecto">
  <div class="panel-images">
    <img src="img/mi-proyecto-1.jpg" alt="...">
    <img src="img/mi-proyecto-2.jpg" alt="...">
  </div>
  <div class="panel-text">
    <h2>Nombre del proyecto</h2>
    <p class="panel-subtitle">Cliente — Ciudad, Año</p>
    <p class="panel-desc">Descripción del proyecto.</p>
    <ul class="panel-tags">
      <li>Tag 1</li>
      <li>Tag 2</li>
    </ul>
  </div>
</div>
```

El `data-project` del botón y el `data-panel` del panel deben ser **el mismo ID**.

## Cómo reemplazar los placeholders de imagen

Cambia los `<div class="img-placeholder">` por etiquetas `<img>`:
```html
<!-- Antes -->
<div class="img-placeholder" style="--c: #5A1070;"></div>

<!-- Después -->
<img src="img/sight-sound-poster.jpg" alt="SIGHT+SOUND poster">
```

Crea una carpeta `img/` y pon ahí tus archivos de imagen.

## Cómo publicar en GitHub Pages

1. Crea un repositorio en github.com
2. Sube estos archivos:
   ```bash
   git init
   git add .
   git commit -m "primera versión"
   git remote add origin https://github.com/TU-USUARIO/rua-studio.git
   git push -u origin main
   ```
3. En GitHub → Settings → Pages → Source: "main branch"
4. Tu sitio estará en `https://TU-USUARIO.github.io/rua-studio/`

## Para ajustar el ancho de la columna izquierda

En `style.css`, línea `--left-w: 380px;`, cambia el valor.
