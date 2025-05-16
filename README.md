
# Projet Nest Chat Websocket

**Ibrahim OUAHABI – 5IW3 ESGI**

---

## 📚 Description

Ce projet est une application web développée avec **NestJS** (backend) et **React + TypeScript** (frontend), permettant aux utilisateurs de :  
✅ Créer un compte et se connecter  
✅ Accéder à un chat en temps réel via WebSocket  
✅ Modifier les options de leur profil, notamment choisir une couleur personnalisée  
✅ Voir la couleur personnalisée des autres utilisateurs dans le chat

---

## 📦 Technologies

- **Backend :** NestJS, WebSocket, TypeScript, JWT Auth  
- **Frontend :** React, TypeScript, WebSocket Client, Styled Components (ou autre, selon choix)  
- **Base de données :** PostgreSQL (ou SQLite pour dev, selon préférences)

---

## 🔧 Structure du projet

```

/backend     → API NestJS + WebSocket
/frontend    → Application React TS

````

---

## 🚀 Objectifs

- Authentification (register + login)
- Système de chat temps réel
- Personnalisation du profil (couleur visible par les autres)
- Code propre, structuré, et documenté

---


## 👤 Auteur

> Ibrahim OUAHABI – 5IW3 ESGI  
> Projet personnel / pédagogique

---

## 💻 Démarrage du projet

1️⃣ **Cloner le repo :**
```bash
git clone https://github.com/tonuser/ton-repo.git
cd ton-repo
````

2️⃣ **Installer les dépendances backend :**

```bash
cd backend
npm install
```

3️⃣ **Installer les dépendances frontend :**

```bash
cd ../frontend
npm install
```

4️⃣ **Lancer les serveurs (dev) :**

```bash
# backend
npm run start:dev

# frontend (dans un autre terminal)
npm start
```

---

## ✨ Notes

Ce projet est réalisé pour valider les compétences techniques en :

* Architecture fullstack (NestJS + React)
* Communication temps réel via WebSocket
* Gestion d’utilisateurs et personnalisation

```