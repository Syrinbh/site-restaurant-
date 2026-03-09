document.addEventListener("DOMContentLoaded", function () {
    try {
        const validPages = ["index.html", "menu.html", "reservation.html", "contact.html",""];
        const currentPage = window.location.pathname.split("/").pop();

        if (validPages.includes(currentPage)) {

            const sections = document.querySelectorAll(".menu-section");
            const titles = document.querySelectorAll('.animate-title');
            const descriptions = document.querySelectorAll('.description');
            const accueilContent = document.querySelector(".accueil1-content");
            const part1 = document.querySelector(".part1"); // RESTAURANT GASTRONOMIQUE
            const part2 = document.querySelector(".part2"); // À CLERMONT-FERRAND

            function checkScroll() {
                const triggerBottom = window.innerHeight * 0.8;

                // Animation sections
                sections.forEach((section) => {
                    if (section.getBoundingClientRect().top < triggerBottom) {
                        section.classList.add("appear");
                    }
                });

                // Animation titres
                titles.forEach((title) => {
                    if (title.getBoundingClientRect().top < triggerBottom) {
                        title.classList.add("visible");
                    }
                });

                // Animation descriptions
                descriptions.forEach((description) => {
                    const position = description.getBoundingClientRect().top;
                    if (position < triggerBottom) {
                        description.style.opacity = 1;
                        description.style.transition = "opacity 1s ease-out";
                    }
                });
            }

            window.addEventListener("scroll", checkScroll);
            checkScroll(); 

            // Animation accueil1 au chargement
            if (accueilContent) {
                accueilContent.style.opacity = "0";
                accueilContent.style.transform = "translateX(-50px)";
                setTimeout(() => {
                    accueilContent.style.transition = "opacity 1s ease-out, transform 1s ease-out";
                    accueilContent.style.opacity = "1";
                    accueilContent.style.transform = "translateX(0)";
                }, 200);
            }

            // Animation du titre accueil2 au scroll
            if (part1 && part2) {
                window.addEventListener("scroll", () => {
                    const scrollY = window.scrollY;
                    const translateX1 = -Math.min(Math.abs(Math.sin(scrollY * 0.02) * 10), 10); // max -10px
                    const translateX2 = Math.min(Math.abs(Math.sin(scrollY * 0.02) * 10), 10);  // max 10px
                    part1.style.transform = `translateX(${translateX1}px)`;
                    part2.style.transform = `translateX(${translateX2}px)`;
                });
            }
        }

    } catch (error) {
        console.error("Erreur dans le script :", error);
    }
});

/* Partie 4 formulaire de la page reservation */ 

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const inputs = {
        lastname: document.getElementById('lastname'),
        firstname: document.getElementById('firstname'),
        birthdate: document.getElementById('birthdate'),
        username: document.getElementById('username'),
        userpwd: document.getElementById('userpwd'),
        useremail: document.getElementById('useremail')
    };

    // Expressions régulières
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[_\-;:!?./*&$]).{12,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Fonctions de validation
    function validateName(value) {
        return value.trim().length > 0;
    }

    // Fonction pour valider la date de naissance
    function validateBirthdate(value) {
        if (!value) return false; 
        const dateParts = value.split('/');
        if (dateParts.length !== 3) return false; 
        const [day, month, year] = dateParts;

        // Vérifier si les parties de la date sont bien des chiffres
        if (!/^\d{2}$/.test(day) || !/^\d{2}$/.test(month) || !/^\d{4}$/.test(year)) {
            return false;
        }

        // Créer la date et vérifier sa validité
        const date = new Date(`${year}-${month}-${day}`);
        return (date.getDate() == day && 
                (date.getMonth() + 1) == month && 
                date.getFullYear() == year);
    }

    function validateUsername(value) {
        return value.length >= 6;
    }

    function validatePassword(value) {
        return passwordRegex.test(value);
    }

    function validateEmail(value) {
        return emailRegex.test(value);
    }

    // Gestion des événements
    Object.entries(inputs).forEach(([name, input]) => {
        input.addEventListener('input', () => {
            validateField(name);
            updateSubmitButton();
        });
    });

    function validateField(name) {
        const value = inputs[name].value;
        let isValid = false;

        switch(name) {
            case 'lastname':
            case 'firstname':
                isValid = validateName(value);
                break;
            case 'birthdate':
                isValid = validateBirthdate(value);
                break;
            case 'username':
                isValid = validateUsername(value);
                break;
            case 'userpwd':
                isValid = validatePassword(value);
                break;
            case 'useremail':
                isValid = validateEmail(value);
                break;
        }

        toggleErrorState(inputs[name], isValid);
    }

    function toggleErrorState(field, isValid) {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
            errorElement.style.display = 'none';
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
            errorElement.style.display = 'block';
        }
    }

    function updateSubmitButton() {
        const isValid = Object.values(inputs).every(input => {
            if (input.required && !input.value) return false;
            return input.classList.contains('valid') || 
                  (!input.required && !input.value);
        });
        
        document.getElementById('submitBtn').disabled = !isValid;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (Object.values(inputs).every(input => 
            input.checkValidity() && !input.classList.contains('invalid'))) {
            form.submit();
            window.location.href = 'index.html';
        }
    });

    // Validation initiale
    Object.keys(inputs).forEach(name => validateField(name));
    updateSubmitButton();
});

//partie formulaire login 
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        // Création d'un objet XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/htbin/login.py', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('username=' + encodeURIComponent(username) + '&userpwd=' + encodeURIComponent(password));

        // Gestion de la réponse du serveur
        xhr.onload = function() {
            if (xhr.status === 200) {
                loginMessage.textContent = xhr.responseText;
            } else {
                loginMessage.textContent = 'Erreur de connexion. Veuillez réessayer.';
            }
        };

        // Gestion des erreurs réseau
        xhr.onerror = function() {
            loginMessage.textContent = 'Erreur de réseau. Veuillez réessayer.';
        };
    });

    // la touche "Entrée"
    document.getElementById('loginPassword').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            loginForm.submit();
        }
    });
});


//partie chatbox 
document.addEventListener('DOMContentLoaded', function() {
    function setupChat() {
        const chatContainer = document.getElementById('chatContainer');
        const chatToggle = document.querySelector('.chat-toggle');

        // Toggle de la chatbox
        chatToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            chatContainer.classList.toggle('active');
        });

        inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        // Actualisation périodique des messages
        setInterval(refreshMessages, 3000);
        refreshMessages();
    }

    // Gestion de l'envoi de messages
    window.sendMessage = function() {
        const input = document.getElementById('messageInput');
        const errorDiv = document.getElementById('errorMessage');
        
        if (!input.value.trim()) {
            errorDiv.textContent = 'Veuillez écrire un message';
            return;
        }

        fetch('../htbin/chatsend.py', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `msg=${encodeURIComponent(input.value)}`
        })
        .then(handleResponse)
        .catch(handleError)
        .finally(() => {
            input.value = '';
            refreshMessages();
        });
    }

    // Fonction d'actualisation des messages
    function refreshMessages() {
        fetch('../htbin/chatget.py')
        .then(response => response.json())
        .then(messages => {
            const container = document.getElementById('chatMessages');
            container.innerHTML = messages.map(msg => `
                <div class="message ${msg.user === 'Staff' ? 'staff' : 'user'}">
                    <div class="message-header">
                        <span class="sender">${msg.user}</span>
                        <span class="time">${new Date().toLocaleTimeString()}</span>
                    </div>
                    <div class="message-content">${msg.msg}</div>
                </div>
            `).join('');
            container.scrollTop = container.scrollHeight;
        });
    }

    // Gestion des réponses
    function handleResponse(response) {
        if (!response.ok) throw new Error('Erreur réseau');
        return response.json();
    }

    // Gestion des erreurs
    function handleError(error) {
        document.getElementById('errorMessage').textContent = error.message;
    }
    
    // Initialisation
    setupChat();
});