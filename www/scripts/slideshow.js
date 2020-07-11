/* var slideIndex = 1
var timer = 0
showSlides(slideIndex)

// Next/previous controls
function plusSlides (n) {
  showSlides(slideIndex += n)
}

// Thumbnail image controls
function currentSlide (n) {
  showSlides(slideIndex = n)
}

function showSlides (n) {
  var i
  var slides = document.getElementsByClassName('mySlides')
  var dots = document.getElementsByClassName('dot')
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  // Substitui o slide, quando passa para o seguinte
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none'
  }
  //  Mostrar o "dot" que está selecionado
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(' active', '')
  }
  slides[slideIndex - 1].style.display = 'block'
  dots[slideIndex - 1].className += ' active'
  setTimeout(plusSlides(1), 2000) // Change image every 2 seconds
}

function myFunction (x) {
  x.classList.toggle('change')
} */

var slideIndex = 0
showSlides()

function showSlides() {
    var i
    var slides = document.getElementsByClassName('mySlides')
    var dots = document.getElementsByClassName('dot')
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none'
    }
    slideIndex++
    if (slideIndex > slides.length) { slideIndex = 1 }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(' active', '')
    }
    slides[slideIndex - 1].style.display = 'block'
    dots[slideIndex - 1].className += ' active'
    setTimeout(showSlides, 4000) // Change image every 2 seconds
}
module.exports.slideshow = showSlides;