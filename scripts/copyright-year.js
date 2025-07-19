// Automatically set copyright year in footer
(function() {
  var year = new Date().getFullYear();
  var els = document.querySelectorAll('#copyright-year');
  els.forEach(function(el) {
    el.textContent = year;
  });
})();
