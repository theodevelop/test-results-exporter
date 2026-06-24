# Fiche de publication — Test Results Exporter

Copier-coller les éléments ci-dessous dans les fiches Firefox Add-ons et Chrome Web Store.

## Nom

Test Results Exporter

## Résumé court

Exporte les résultats visibles d’une page de tests vers un fichier JSON local.

## Description longue

Test Results Exporter permet d’exporter dans un fichier JSON les résultats déjà visibles dans une page de tests compatible.

L’extension peut inclure :

- les catégories et les noms de tests ;
- leur statut visible : réussi, échoué ou inconnu ;
- les messages et différences affichés pour les tests échoués.

L’export se lance uniquement lorsque l’utilisateur clique sur le bouton de l’extension. Une barre de progression indique le test en cours et l’avancement global.

### Respect de la confidentialité

- aucune donnée n’est envoyée à un serveur ;
- aucun compte, cookie, outil d’analyse ou publicité ;
- aucune lecture des requêtes réseau ou du contenu non affiché ;
- le fichier JSON est téléchargé localement par le navigateur.

L’extension utilise uniquement les permissions `activeTab` et `scripting`, nécessaires pour lire les éléments déjà affichés dans l’onglet actif après une action explicite de l’utilisateur.

## Catégorie recommandée

Outils de développement / Developer Tools

## Tags / mots-clés

export, test results, JSON, test failures, developer tools, debugging

## Support

- E-mail : irujotheo@gmail.com
- Dépôt : à renseigner après publication sur GitHub
- Politique de confidentialité : lien vers `docs/PRIVACY_POLICY.md` publié sur GitHub

## Réponses Chrome Web Store — Privacy practices

### Single purpose

Exporter dans un fichier JSON les résultats de tests déjà visibles dans la page active, à la demande de l’utilisateur.

### Justification de `activeTab`

L’extension doit agir seulement dans l’onglet actif et uniquement après que l’utilisateur a cliqué sur son bouton d’export.

### Justification de `scripting`

L’extension injecte un script local dans l’onglet actif pour lire les éléments déjà rendus par la page et construire le fichier JSON local.

### Données utilisateur

Aucune donnée utilisateur n’est collectée, vendue, transmise ou utilisée hors de l’appareil. Les données visibles sont traitées localement et téléchargées dans un fichier JSON à l’initiative de l’utilisateur.
