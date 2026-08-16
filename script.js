document.addEventListener('DOMContentLoaded', function () {
    var tabs = document.querySelectorAll('nav ul li a');
    var slides = document.querySelectorAll('.slide');

    function switchTab(targetId, clickedTab) {
        slides.forEach(function (slide) {
            slide.classList.remove('active');
        });
        tabs.forEach(function (t) {
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

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            var target = this.getAttribute('href').substring(1);
            switchTab(target, this);
        });
    });

    var mitoRealidadButtons = document.querySelectorAll('.opcion-btn');
    var respuestaPanel = document.getElementById('respuesta-mito-realidad');

    mitoRealidadButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            mitoRealidadButtons.forEach(function (btn) {
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

    var currentQSpan = document.getElementById('quiz-current');
    var totalQSpan = document.getElementById('quiz-total');
    var progressFill = document.getElementById('quiz-progress-fill');
    var quizContainer = document.getElementById('quiz-container');
    var quizHeader = document.getElementById('quiz-header');

    if (totalQSpan) {
        totalQSpan.textContent = quizQuestions.length;
    }

    function resetQuiz() {
        quizQuestions.forEach(function (q, index) {
            q.classList.remove('active');
            var options = q.querySelectorAll('.quiz-option');
            var feedback = q.querySelector('.quiz-feedback');

            options.forEach(function (btn) {
                btn.classList.remove('active', 'correct', 'incorrect');
                btn.disabled = false;
            });

            feedback.className = 'quiz-feedback';
            feedback.textContent = '';
        });

        quizResult.classList.remove('visible');
        quizResult.innerHTML = '';
        quizHeader.style.display = 'block';

        if (quizQuestions.length > 0) {
            quizQuestions[0].classList.add('active');
            updateProgress(1);
        }
    }

    function updateProgress(current) {
        if (currentQSpan) currentQSpan.textContent = current;
        if (progressFill) {
            var percentage = (current / quizQuestions.length) * 100;
            progressFill.style.width = percentage + '%';
        }
    }

    quizQuestions.forEach(function (question, index) {
        var options = question.querySelectorAll('.quiz-option');
        var feedback = question.querySelector('.quiz-feedback');
        var correctAnswer = question.dataset.correct;

        options.forEach(function (option) {
            option.addEventListener('click', function () {
                var selected = this.dataset.answer;

                options.forEach(function (btn) {
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
                    options.forEach(function (btn) {
                        if (btn.dataset.answer === correctAnswer) {
                            btn.classList.add('correct');
                        }
                    });
                    feedback.textContent = '❌ Incorrecto. La respuesta correcta es la opción marcada en verde.';
                    feedback.className = 'quiz-feedback visible incorrect';

                    // Shake animation for incorrect answer
                    if (quizContainer) {
                        quizContainer.classList.add('shake');
                        setTimeout(function () {
                            quizContainer.classList.remove('shake');
                        }, 500);
                    }
                }

                setTimeout(function () {
                    question.classList.remove('active');

                    if (index + 1 < quizQuestions.length) {
                        quizQuestions[index + 1].classList.add('active');
                        updateProgress(index + 2);
                    } else {
                        quizHeader.style.display = 'none';
                        var correctCount = 0;
                        quizQuestions.forEach(function (q) {
                            var selectedOption = q.querySelector('.quiz-option.active');
                            if (selectedOption && selectedOption.dataset.answer === q.dataset.correct) {
                                correctCount++;
                            }
                        });

                        var scorePercentage = correctCount / quizQuestions.length;
                        var emoji = '👏';
                        var title = '¡Buen intento!';

                        if (scorePercentage === 1) {
                            emoji = '🏆';
                            title = '¡Excelente, puntaje perfecto!';
                        } else if (scorePercentage >= 0.6) {
                            emoji = '⭐';
                            title = '¡Muy bien hecho!';
                        } else {
                            emoji = '📖';
                            title = 'Puedes mejorar, ¡repasa el material!';
                        }

                        quizResult.innerHTML = `
                            <div class="score-emoji">${emoji}</div>
                            <div class="score-text">${title}</div>
                            <div class="score-desc">Has acertado <strong>${correctCount}</strong> de ${quizQuestions.length} preguntas.</div>
                            <button class="btn-reintentar" id="btn-reintentar">Volver a intentar</button>
                        `;
                        quizResult.classList.add('visible');

                        document.getElementById('btn-reintentar').addEventListener('click', resetQuiz);
                    }
                }, 1800);
            });
        });
    });

    var btnExplorar = document.getElementById('btn-explorar');
    var portada = document.getElementById('portada');
    var contenidoPrincipal = document.getElementById('contenido-principal');

    if (btnExplorar && portada && contenidoPrincipal) {
        btnExplorar.addEventListener('click', function () {
            portada.style.display = 'none';
            contenidoPrincipal.style.display = 'block';
            window.scrollTo(0, 0);
        });

        btnExplorar.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
});
