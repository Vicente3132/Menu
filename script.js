import * as pdfjsLib from './build/pdf.mjs';

// Configura el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = './build/pdf.worker.mjs';

// URL del PDF
const url = "./1.pdf";

// Obtén el elemento canvas y su contexto
const canvas = document.getElementById('pdf-canvas');
const context = canvas.getContext('2d');

// Función para ajustar el tamaño del canvas
function resizeCanvas() {
  const container = canvas.parentElement; // Contenedor del canvas
  const width = container.clientWidth; // Ancho del contenedor
  const height = container.clientHeight; // Alto del contenedor

  // Ajusta el tamaño del canvas
  canvas.width = width;
  canvas.height = height;
}

// Función para renderizar el PDF
function renderPDF(pdf, pageNumber) {
  pdf.getPage(pageNumber).then(page => {
    const viewport = page.getViewport({ scale: 1 });

    // Escala el PDF para que se ajuste al ancho del canvas
    const scale = canvas.width / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    // Ajusta el tamaño del canvas según la escala
    canvas.height = scaledViewport.height;

    // Renderiza la página
    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport,
    };
    page.render(renderContext);
  });
}

// Carga y renderiza el PDF
pdfjsLib.getDocument({
  url: url,
  cMapUrl: './web/cmaps/', // Ruta a la carpeta cmaps
  cMapPacked: true, // Indica que los archivos .bcmap están empaquetados
}).promise.then(pdf => {
  console.log("PDF cargado correctamente:", pdf);

  // Ajusta el tamaño del canvas al cargar la página
  resizeCanvas();
  renderPDF(pdf, 1);

  // Ajusta el tamaño del canvas cuando cambia el tamaño de la ventana
  window.addEventListener('resize', () => {
    resizeCanvas();
    renderPDF(pdf, 1);
  });
}).catch(error => {
  console.error("Error al cargar el PDF:", error);
});