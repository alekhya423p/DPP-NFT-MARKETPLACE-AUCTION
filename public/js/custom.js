var acc = document.getElementsByClassName("myaccordion");
var i;
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function(event) {
    event.preventDefault();
    this.classList.toggle("aco_active");
    var panels2 = this.nextElementSibling;
    if (panels2.style.maxHeight) {
      panels2.style.maxHeight = null;
    } else {
      panels2.style.maxHeight = panels2.scrollHeight + "px";
    } 
  });
}