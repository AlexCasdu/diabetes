document.addEventListener('DOMContentLoaded', function() {
    var tabs = document.querySelectorAll('nav ul li a');
    var slides = document.querySelectorAll('.slide');

    function switchTab(targetId, clickedTab) {
        slides.forEach(function(slide) {
            slide.classList.remove('active');
        });
        tabs.forEach(function(t) {
            t.classList.remove('active');
        });

        var targetSlide = document.getElementById(targetId);
        if (targetSlide) {
            targetSlide.classList.add('active');
        }
        if (clickedTab) {
            clickedTab.classList.add('active');
        }

        var nav = document.querySelector('nav');
        if (nav) {
            window.scrollTo({
                top: nav.offsetTop,
                behavior: 'smooth'
            });
        }
    }

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            var target = this.getAttribute('href').substring(1);
            switchTab(target, this);
        });
    });

    var mitoRealidadButtons = document.querySelectorAll('.opcion-btn');
    var respuestaPanel = document.getElementById('respuesta-mito-realidad');

    mitoRealidadButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            mitoRealidadButtons.forEach(function(btn) {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });

            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');

            respuestaPanel.classList.remove('correcta', 'incorrecta');
            var seleccion = this.dataset.respuesta;
            if (seleccion === 'mito') {
                respuestaPanel.innerHTML = '<strong>✅ ¡Correcto! Es un mito.</strong> La diabetes no se produce solo por consumir mucha azúcar. Hay varios factores, como la genética, la resistencia a la insulina, la obesidad, el sedentarismo y otros procesos fisiológicos.';
                respuestaPanel.classList.add('visible', 'correcta');
            } else {
                respuestaPanel.innerHTML = '<strong>❌ Incorrecto. La respuesta correcta es: mito.</strong> Consumir azúcar en exceso puede aumentar el riesgo de obesidad y otras condiciones de salud, pero la diabetes no se debe únicamente a eso.';
                respuestaPanel.classList.add('visible', 'incorrecta');
            }
        });
    });

    var quizQuestions = document.querySelectorAll('.quiz-question');
    var quizResult = document.getElementById('quiz-result');

    if (quizQuestions.length > 0) {
        quizQuestions[0].classList.add('active');
    }

    quizQuestions.forEach(function(question, index) {
        var options = question.querySelectorAll('.quiz-option');
        var feedback = question.querySelector('.quiz-feedback');
        var correctAnswer = question.dataset.correct;

        options.forEach(function(option) {
            option.addEventListener('click', function() {
                var selected = this.dataset.answer;

                options.forEach(function(btn) {
                    btn.classList.remove('active', 'correct', 'incorrect');
                    btn.disabled = true;
                });

                this.classList.add('active');

                if (selected === correctAnswer) {
                    this.classList.add('correct');
                    feedback.textContent = '✅ Correcto.';
                    feedback.className = 'quiz-feedback visible correct';
                } else {
                    this.classList.add('incorrect');
                    options.forEach(function(btn) {
                        if (btn.dataset.answer === correctAnswer) {
                            btn.classList.add('correct');
                        }
                    });
                    feedback.textContent = '❌ Incorrecto. La respuesta correcta es la opción marcada en verde.';
                    feedback.className = 'quiz-feedback visible incorrect';
                }

                setTimeout(function() {
                    question.classList.remove('active');

                    if (index + 1 < quizQuestions.length) {
                        quizQuestions[index + 1].classList.add('active');
                    } else {
                        var correctCount = 0;
                        quizQuestions.forEach(function(q) {
                            var selectedOption = q.querySelector('.quiz-option.active');
                            if (selectedOption && selectedOption.dataset.answer === q.dataset.correct) {
                                correctCount++;
                            }
                        });

                        var message = 'Resultado: ' + correctCount + ' de ' + quizQuestions.length + ' respuestas correctas.';
                        quizResult.textContent = message;
                        quizResult.classList.add('visible');
                    }
                }, 1500);
            });
        });
    });

    var scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            var nav = document.querySelector('nav');
            if (nav) {
                nav.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
