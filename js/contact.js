// Gestion du formulaire de contact
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation du formulaire
            if (validateForm()) {
                // Simulation d'envoi (en production, envoyer les données au serveur)
                simulateFormSubmission();
            }
        });
    }
    
    // Fonction de validation du formulaire
    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        // Réinitialiser les messages d'erreur
        clearErrorMessages();
        
        // Vérifier chaque champ requis
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'Ce champ est obligatoire.');
                isValid = false;
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                showFieldError(field, 'Veuillez entrer une adresse email valide.');
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Fonction pour valider l'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Fonction pour afficher une erreur de champ
    function showFieldError(field, message) {
        field.style.borderColor = '#dc3545';
        
        // Créer un élément d'erreur s'il n'existe pas
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '5px';
    }
    
    // Fonction pour effacer les messages d'erreur
    function clearErrorMessages() {
        const errorMessages = contactForm.querySelectorAll('.field-error');
        const fields = contactForm.querySelectorAll('input, select, textarea');
        
        errorMessages.forEach(error => error.remove());
        fields.forEach(field => field.style.borderColor = '#ddd');
    }
    
    // Simulation d'envoi du formulaire
    function simulateFormSubmission() {
        // Afficher un indicateur de chargement
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Envoi en cours...';
        submitButton.disabled = true;
        
        // Simuler un délai d'envoi
        setTimeout(() => {
            // Afficher un message de succès
            formMessage.textContent = 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.';
            formMessage.className = 'form-message success';
            formMessage.style.display = 'block';
            
            // Réinitialiser le formulaire
            contactForm.reset();
            
            // Restaurer le bouton
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Faire défiler jusqu'au message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Masquer le message après 5 secondes
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
            
        }, 1500);
    }
    
    // Amélioration de l'expérience utilisateur
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        // Ajouter une classe lorsque le champ est rempli
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.classList.add('filled');
            } else {
                this.classList.remove('filled');
            }
        });
        
        // Validation en temps réel pour l'email
        if (input.type === 'email') {
            input.addEventListener('blur', function() {
                if (this.value.trim() && !isValidEmail(this.value)) {
                    showFieldError(this, 'Veuillez entrer une adresse email valide.');
                } else {
                    clearFieldError(this);
                }
            });
        }
    });
    
    // Fonction pour effacer l'erreur d'un champ spécifique
    function clearFieldError(field) {
        field.style.borderColor = '#ddd';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
});