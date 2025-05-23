# 💬 Projet NestJS Chat WebSocket

**Ibrahim OUAHABI – 5IW3 ESGI**

---

## 📚 Description

Ce projet est une application web de chat en temps réel développée avec **NestJS** pour le backend et **React + TypeScript** pour le frontend.

Fonctionnalités principales :
- ✅ Création de compte et authentification (JWT)
- ✅ Connexion à un chat en temps réel via WebSocket
- ✅ Envoi de messages publics et privés (DM)
- ✅ Réactions aux messages (❤️ 👍 😂)
- ✅ Modification du profil : avatar + couleur personnalisée
- ✅ Sauvegarde des préférences (couleur, avatar) en base de données
- ✅ Système de réinitialisation du mot de passe avec envoi d’email (token + expiration)

---

## ⚙️ Technologies utilisées

| Côté | Stack |
|------|-------|
| **Frontend** | React, TypeScript, SCSS, WebSocket |
| **Backend** | NestJS, TypeORM, PostgreSQL, JWT, WebSocket |
| **Emailing** | Nodemailer (via Gmail App Password) |
| **Divers** | Docker (PostgreSQL), JWT, Bcrypt |

---

## 📁 Structure du projet

```

Projet-NestJS-Chat/
├── backend/        → API NestJS + WebSocket + Auth + Mailing
├── frontend/       → App React TypeScript (interface utilisateur)
└── .env            → Variables sensibles pour l'envoi d'email

```

---

## 🔒 Configuration du backend

Créer un fichier `.env` dans le dossier `backend/` avec ce contenu :

```

EMAIL\_USER=[ton.email@gmail.com](mailto:ton.email@gmail.com)
EMAIL\_PASS=ton\_mot\_de\_passe\_d\_application

````

> 💡 Ces identifiants sont utilisés pour l’envoi de mails (réinitialisation de mot de passe via Gmail).

---

## 🚀 Lancer le projet en local

### 1. Cloner le dépôt

```bash
git clone https://github.com/Narutino10/Projet-NestJS-Chat
cd Projet-NestJS-Chat
````

### 2. Backend

```bash
cd backend
npm install
npm run start:dev
```

### 3. Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 👤 Auteur

**Ibrahim OUAHABI**

> Étudiant ESGI 5IW3
> Projet pédagogique individuel – sans soutenance

---

## ✅ Objectifs du projet

* Authentification complète avec NestJS
* Chat en temps réel via WebSocket
* Personnalisation utilisateur persistante (couleur, avatar)
* Interface claire et responsive en React
* Intégration d'un système de mot de passe oublié sécurisé

---