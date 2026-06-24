# Checklist de publication

## Avant toute soumission

- [ ] Tester l’export sur une page réelle dans Firefox.
- [ ] Tester l’export sur une page réelle dans Chrome ou Chromium.
- [ ] Vérifier que le JSON ne contient aucun secret, token, mot de passe ou URL sensible inutile.
- [ ] Prendre 2 à 4 captures réelles de l’extension ouverte sur une page compatible : état initial, export en cours, succès final.
- [ ] Publier ce dépôt sur GitHub et rendre `docs/PRIVACY_POLICY.md` accessible par un lien public.
- [ ] Renseigner le lien GitHub dans `docs/STORE_LISTING_FR.md`.

## Firefox Add-ons (AMO)

- [ ] Créer / connecter le compte Mozilla Developer.
- [ ] Téléverser `dist/test-results-exporter-firefox-v1.0.0.zip`.
- [ ] Choisir une publication listée sur AMO ou une distribution non listée mais signée.
- [ ] Ajouter le nom, le résumé, la description, la catégorie et l’e-mail de support.
- [ ] Ajouter les captures réelles.
- [ ] Déclarer la licence MIT.
- [ ] Ajouter l’URL de la politique de confidentialité.
- [ ] Répondre aux éventuels avertissements du validateur avant envoi final.

## Chrome Web Store

- [ ] Créer / finaliser le compte développeur Google.
- [ ] Téléverser `dist/test-results-exporter-chrome-v1.0.0.zip`.
- [ ] Ajouter le nom, le résumé, la description, l’icône et les captures réelles.
- [ ] Choisir la catégorie Developer Tools.
- [ ] Remplir l’onglet Privacy practices avec les réponses de `STORE_LISTING_FR.md`.
- [ ] Ajouter l’URL de la politique de confidentialité.
- [ ] Choisir la visibilité et les pays de distribution.
- [ ] Soumettre à validation.

## Après publication

- [ ] Ajouter les liens AMO et Chrome Web Store au README.
- [ ] Mettre à jour l’e-mail / dépôt de support, si nécessaire.
- [ ] Créer une release GitHub correspondant au tag `v1.0.0`.
