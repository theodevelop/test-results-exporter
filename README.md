# Test Results Exporter

Extension WebExtension (Manifest V3) pour exporter dans un fichier JSON les résultats de tests **déjà visibles** sur la page active :

- catégories et nom des tests ;
- statut visible (réussi / échoué / inconnu) ;
- messages d’échec visibles, lorsqu’ils sont affichés par la page.

## Confidentialité

L’extension ne possède ni serveur, ni analytics, ni permission d’accès permanent aux sites. Elle s’exécute seulement après un clic de l’utilisateur sur son bouton, dans l’onglet actif, grâce à `activeTab` et `scripting`.

Elle ne lit pas les requêtes réseau, ne contourne pas l’authentification et ne récupère pas de contenu non rendu par la page. Le résultat est téléchargé localement sur l’ordinateur de l’utilisateur.

Consulte [`docs/PRIVACY_POLICY.md`](docs/PRIVACY_POLICY.md) pour la version complète.

## Développement local

### Firefox

1. Ouvrir `about:debugging#/runtime/this-firefox`.
2. Cliquer sur **Charger un module complémentaire temporaire**.
3. Charger le dossier : Firefox utilise `manifest.json` pour le test temporaire.
4. Pour une installation signée ou une soumission AMO, utiliser le package `dist/test-results-exporter-firefox-v1.0.0.zip` généré par le script de build.

### Chrome, Chromium, Brave

1. Ouvrir `chrome://extensions`.
2. Activer le **Mode développeur**.
3. Cliquer sur **Charger l’extension non empaquetée**.
4. Sélectionner ce dossier : `manifest.json` est déjà prêt pour Chrome.

## Générer les packages de publication

```bash
node scripts/build.mjs
```

Les fichiers apparaissent dans `dist/` : un ZIP pour Chrome Web Store, un ZIP pour Firefox/AMO et un ZIP source.

## Licence

MIT — voir [`LICENSE`](LICENSE).
