// Gestion de la navigation mobile
document.addEventListener('DOMContentLoaded', function() {
    // Menu déroulant pour mobile
    const navItems = document.querySelectorAll('.nav-menu > li');
    
    if (window.innerWidth <= 768) {
        navItems.forEach(item => {
            if (item.querySelector('.dropdown-menu')) {
                const link = item.querySelector('a');
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const dropdown = this.nextElementSibling;
                    const isVisible = dropdown.style.display === 'block';
                    
                    // Fermer tous les autres menus déroulants
                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                        menu.style.display = 'none';
                    });
                    
                    // Ouvrir/fermer le menu actuel
                    dropdown.style.display = isVisible ? 'none' : 'block';
                });
            }
        });
    }
    
    // Gestion des onglets de vérification d'électeur
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Désactiver tous les boutons et contenus
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activer le bouton et le contenu sélectionnés
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Affichage de la section de vérification d'électeur
    const verifyLinks = document.querySelectorAll('#verify-voter-link, #verify-voter-btn');
    const voterSection = document.getElementById('voter-verification');
    
    verifyLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            voterSection.style.display = 'block';
            voterSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
});