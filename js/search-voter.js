// Simulation de la recherche d'électeur dans un fichier CSV
document.addEventListener('DOMContentLoaded', function() {
    // Données simulées (en production, cela viendrait d'un vrai fichier CSV)
    const votersData = [
        { id: '123456', lastName: 'KOUNA', firstName: 'Jean', birthDate: '1980-05-15', pollingStation: 'Bangui Centre' },
        { id: '234567', lastName: 'MBALLA', firstName: 'Marie', birthDate: '1985-08-22', pollingStation: 'Bangui Ouest' },
        { id: '345678', lastName: 'NGOUPANDOU', firstName: 'Pierre', birthDate: '1975-12-10', pollingStation: 'Bangui Est' },
        { id: '456789', lastName: 'SAMBA', firstName: 'Alice', birthDate: '1990-03-30', pollingStation: 'Bimbo' },
        { id: '567890', lastName: 'YAKITE', firstName: 'Paul', birthDate: '1982-07-18', pollingStation: 'Begoua' }
    ];
    
    // Formulaire de recherche par numéro
    const numeroForm = document.getElementById('numero-form');
    const numeroInput = document.getElementById('voter-number');
    
    // Formulaire de recherche par informations personnelles
    const infoForm = document.getElementById('info-form');
    const lastNameInput = document.getElementById('last-name');
    const firstNameInput = document.getElementById('first-name');
    const birthDateInput = document.getElementById('birth-date');
    
    // Section de résultat
    const resultSection = document.getElementById('verification-result');
    const resultContent = document.getElementById('result-content');
    
    // Recherche par numéro d'électeur
    numeroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const voterNumber = numeroInput.value.trim();
        
        if (!voterNumber) {
            showResult('Veuillez entrer un numéro d\'électeur.', false);
            return;
        }
        
        const voter = votersData.find(v => v.id === voterNumber);
        
        if (voter) {
            showResult(`
                <div class="result-success">
                    <p><strong>Votre inscription a été confirmée.</strong></p>
                    <p>Nom: ${voter.lastName}</p>
                    <p>Prénom: ${voter.firstName}</p>
                    <p>Date de naissance: ${formatDate(voter.birthDate)}</p>
                    <p>Bureau de vote: ${voter.pollingStation}</p>
                </div>
            `, true);
        } else {
            showResult('Aucun électeur trouvé avec ce numéro. Veuillez vérifier votre saisie ou contacter votre mairie.', false);
        }
    });
    
    // Recherche par informations personnelles
    infoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const lastName = lastNameInput.value.trim().toUpperCase();
        const firstName = firstNameInput.value.trim().toUpperCase();
        const birthDate = birthDateInput.value;
        
        if (!lastName || !firstName || !birthDate) {
            showResult('Veuillez remplir tous les champs.', false);
            return;
        }
        
        const voter = votersData.find(v => 
            v.lastName.toUpperCase() === lastName && 
            v.firstName.toUpperCase() === firstName && 
            v.birthDate === birthDate
        );
        
        if (voter) {
            showResult(`
                <div class="result-success">
                    <p><strong>Votre inscription a été confirmée.</strong></p>
                    <p>Numéro d'électeur: ${voter.id}</p>
                    <p>Nom: ${voter.lastName}</p>
                    <p>Prénom: ${voter.firstName}</p>
                    <p>Date de naissance: ${formatDate(voter.birthDate)}</p>
                    <p>Bureau de vote: ${voter.pollingStation}</p>
                </div>
            `, true);
        } else {
            showResult('Aucun électeur trouvé avec ces informations. Veuillez vérifier votre saisie ou contacter votre mairie.', false);
        }
    });
    
    // Fonction pour afficher le résultat
    function showResult(message, isSuccess) {
        resultContent.innerHTML = message;
        resultSection.style.display = 'block';
        
        // Faire défiler jusqu'au résultat
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Fonction pour formater la date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    }
});