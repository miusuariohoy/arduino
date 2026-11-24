/* ============================================================
   app.js · navegación activa y progreso de la portada
   ============================================================ */
(function(){
  'use strict';

  function resaltarEnlaces(){
    const enlaces = Array.from(document.querySelectorAll('nav a[href^="#"]'));
    constObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        enlaces.forEach(function(a){
          a.style.background = a.getAttribute('href') === '#' + entry.target.id ? 'rgba(255,255,255,.24)' : '';
        });
      });
    }, enlaces);
  }

  var observerGlobal = null;
  function constObserver(callback, enlaces){
    const ids = enlaces.map(function(a){ return a.getAttribute('href').slice(1); });
    const secciones = ids.map(function(id){ return document.getElementById(id); }).filter(Boolean);
    if (!secciones.length || !window.IntersectionObserver) return;
    if (observerGlobal) observerGlobal.disconnect();
    observerGlobal = new IntersectionObserver(callback, { rootMargin:'-20% 0px -70% 0px', threshold:0 });
    secciones.forEach(function(s){ observerGlobal.observe(s); });
  }

  function progreso(){
    const total = document.querySelectorAll('.ejercicio').length;
    const listos = document.querySelectorAll('.ejercicio.correcto').length;
    const nodo = document.getElementById('progreso-ejercicios');
    if (!nodo || !total) return;
    nodo.textContent = 'Progreso: ' + listos + ' de ' + total + ' actividades correctas.';
    nodo.style.width = Math.round(listos / total * 100) + '%';
  }

  document.addEventListener('click', function(e){
    const accion = e.target.closest('.ejercicio .corregir, .ejercicio .limpiar');
    if (accion) setTimeout(progreso, 0);
  });

  resaltarEnlaces();
  progreso();
})();
