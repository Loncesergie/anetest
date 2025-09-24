// Recherche d'électeur avec lecture réelle du fichier CSV
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales pour stocker les données CSV
    let votersData = [];
    let csvLoaded = false;

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
    
    // Charger le fichier CSV au démarrage
    loadCSVData();

    // Fonction pour charger les données CSV
    function loadCSVData() {
        showLoadingMessage('Chargement des données électorales...');
        
        // Utilisation de Fetch API pour lire le fichier CSV
        fetch('data/voters.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fichier CSV non trouvé');
                }
                return response.text();
            })
            .then(csvText => {
                votersData = parseCSV(csvText);
                csvLoaded = true;
                hideLoadingMessage();
                console.log('Données CSV chargées avec succès:', votersData.length, 'électeurs');
            })
            .catch(error => {
                console.error('Erreur lors du chargement du CSV:', error);
                showResult('Erreur: Impossible de charger les données électorales. Veuillez réessayer plus tard.', false);
                // Chargement des données de secours (simulées)
                loadFallbackData();
            });
    }

    // Fonction pour parser le CSV
    function parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const values = parseCSVLine(line);
                if (values.length === headers.length) {
                    const entry = {};
                    headers.forEach((header, index) => {
                        entry[header] = values[index].trim();
                    });
                    data.push(entry);
                }
            }
        }
        
        return data;
    }

    // Fonction pour parser correctement les lignes CSV (gère les virgules dans les champs)
    function parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current);
        return values;
    }

    // Données de secours si le CSV n'est pas disponible
    function loadFallbackData() {
        votersData = [
            { id: '123456', nom: 'KOUNA', prenom: 'Jean', date_naissance: '1980-05-15', bureau_vote: 'Bangui Centre', commune: 'Bangui' },
            { id: '234567', nom: 'MBALLA', prenom: 'Marie', date_naissance: '1985-08-22', bureau_vote: 'Bangui Ouest', commune: 'Bangui' },
            { id: '345678', nom: 'NGOUPANDOU', prenom: 'Pierre', date_naissance: '1975-12-10', bureau_vote: 'Bangui Est', commune: 'Bangui' },
            { id: '456789', nom: 'SAMBA', prenom: 'Alice', date_naissance: '1990-03-30', bureau_vote: 'Bimbo', commune: 'Bimbo' },
            { id: '567890', nom: 'YAKITE', prenom: 'Paul', date_naissance: '1982-07-18', bureau_vote: 'Begoua', commune: 'Begoua' }
        ];
        csvLoaded = true;
        hideLoadingMessage();
        console.log('Données de secours chargées');
    }

    // Recherche par numéro d'électeur
    numeroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!csvLoaded) {
            showResult('Les données électorales ne sont pas encore chargées. Veuillez réessayer dans quelques instants.', false);
            return;
        }
        
        const voterNumber = numeroInput.value.trim();
        
        if (!voterNumber) {
            showResult('Veuillez entrer un numéro d\'électeur.', false);
            return;
        }
        
        const voter = votersData.find(v => v.id === voterNumber || v.numero === voterNumber);
        
        if (voter) {
            showResult(`
                <div class="result-success">
                    <h4>✅ Votre inscription a été confirmée</h4>
                    <div class="voter-info">
                        <p><strong>Numéro d'électeur:</strong> ${voter.id || voter.numero}</p>
                        <p><strong>Nom:</strong> ${voter.nom}</p>
                        <p><strong>Prénom:</strong> ${voter.prenom}</p>
                        <p><strong>Bureau de vote:</strong> ${voter.bureau_vote}</p>
                        <p><strong>Commune:</strong> ${voter.commune || 'Non spécifié'}</p>
                        <p><strong>Circonscription:</strong> ${voter.circonscription || 'Non spécifié'}</p>
                    </div>
                    <div class="result-note">
                        <p><em>Pour des raisons de protection des données personnelles, certaines informations sensibles ne sont pas affichées.</em></p>
                    </div>
                    <div class="result-actions">
                        <button onclick="window.print()" class="btn btn-secondary">Imprimer cette page</button>
                    </div>
                </div>
            `, true);
        } else {
            showResult(`
                <div class="result-error">
                    <h4>❌ Aucun électeur trouvé</h4>
                    <p>Aucun électeur trouvé avec le numéro <strong>${voterNumber}</strong>.</p>
                    <p>Veuillez vérifier votre saisie ou contacter le centre d'inscription électoral.</p>
                    <div class="suggestions">
                        <p><strong>Suggestions :</strong></p>
                        <ul>
                            <li>Vérifiez que vous avez saisi le bon numéro</li>
                            <li>Essayez la recherche par nom et prénom</li>
                            <li>Contactez le service électoral au +236 XX XX XX XX</li>
                        </ul>
                    </div>
                </div>
            `, false);
        }
    });
    
    // Recherche par informations personnelles
    infoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!csvLoaded) {
            showResult('Les données électorales ne sont pas encore chargées. Veuillez réessayer dans quelques instants.', false);
            return;
        }
        
        const lastName = lastNameInput.value.trim().toUpperCase();
        const firstName = firstNameInput.value.trim().toUpperCase();
        const birthDate = birthDateInput.value;
        
        if (!lastName || !firstName || !birthDate) {
            showResult('Veuillez remplir tous les champs.', false);
            return;
        }
        
        // Normaliser la date de naissance (supprimer les tirets pour la comparaison)
        const normalizedBirthDate = birthDate.replace(/-/g, '');
        
        const voter = votersData.find(v => {
            const voterLastName = (v.nom || '').toUpperCase();
            const voterFirstName = (v.prenom || '').toUpperCase();
            const voterBirthDate = (v.date_naissance || '').replace(/-/g, '');
            
            return voterLastName === lastName && 
                   voterFirstName === firstName && 
                   voterBirthDate === normalizedBirthDate;
        });
        
        if (voter) {
            showResult(`
                <div class="result-success">
                    <h4>✅ Votre inscription a été confirmée</h4>
                    <div class="voter-info">
                        <p><strong>Numéro d'électeur:</strong> ${voter.id || voter.numero}</p>
                        <p><strong>Nom:</strong> ${voter.nom}</p>
                        <p><strong>Prénom:</strong> ${voter.prenom}</p>
                        <p><strong>Bureau de vote:</strong> ${voter.bureau_vote}</p>
                        <p><strong>Commune:</strong> ${voter.commune || 'Non spécifié'}</p>
                        <p><strong>Circonscription:</strong> ${voter.circonscription || 'Non spécifié'}</p>
                    </div>
                    <div class="result-note">
                        <p><em>Pour des raisons de protection des données personnelles, certaines informations sensibles ne sont pas affichées.</em></p>
                    </div>
                    <div class="result-actions">
                        <button onclick="window.print()" class="btn btn-secondary">Imprimer cette page</button>
                    </div>
                </div>
            `, true);
        } else {
            showResult(`
                <div class="result-error">
                    <h4>❌ Aucun électeur trouvé</h4>
                    <p>Aucun électeur trouvé avec les informations suivantes :</p>
                    <ul>
                        <li><strong>Nom:</strong> ${lastName}</li>
                        <li><strong>Prénom:</strong> ${firstName}</li>
                    </ul>
                    <p>Veuillez vérifier votre saisie ou contacter le centre d'inscription électoral.</p>
                    <div class="suggestions">
                        <p><strong>Suggestions :</strong></p>
                        <ul>
                            <li>Vérifiez l'orthographe de votre nom et prénom</li>
                            <li>Assurez-vous que la date de naissance est correcte</li>
                            <li>Essayez la recherche par numéro d'électeur</li>
                            <li>Contactez le service électoral au +236 XX XX XX XX</li>
                        </ul>
                    </div>
                </div>
            `, false);
        }
    });
    
    // Fonction pour afficher le résultat
    function showResult(message, isSuccess) {
        resultContent.innerHTML = message;
        resultSection.style.display = 'block';
        
        // Faire défiler jusqu'au résultat
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Fonction pour afficher un message de chargement
    function showLoadingMessage(message) {
        resultContent.innerHTML = `
            <div class="loading-message">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        resultSection.style.display = 'block';
    }
    
    // Fonction pour masquer le message de chargement
    function hideLoadingMessage() {
        if (resultContent.querySelector('.loading-message')) {
            resultContent.innerHTML = '';
            resultSection.style.display = 'none';
        }
    }
    
    // Indicateur de statut de chargement dans la console
    console.log('Système de recherche électorale initialisé');
});
