
# Chat App

A cross-platform real-time chat application built with React Native and Expo, featuring Firebase backend integration, offline message caching, media uploads, and location sharing.

This project demonstrates full-stack mobile development, real-time data handling, offline-first architecture, and native device feature integration.

## Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Frontend** | React Native, Expo, JavaScript |
| **UI Library** | Gifted Chat |
| **Navigation** | React Navigation (Native Stack) |
| **Backend** |  Firebase Firestore (real-time databse) |
| **Authentication** | Firebase Anonymous Auth |
| **Storage** | Firebase Cloud Storage |
| **Offline Support** | AsyncStorage |
| **Network Detection** | NetInfo |
| **Native APIs** | Expo ImagePicker, Expo Location |
| **Maps** | react-native-maps |
| **Development Tools** | Expo CLI, Metro Bundler |
| **Testing** | Android Emulator, iOS Simulator |
| **Build Tools** | npm |
| **Other** | Expo Go |

## Features
- Authentication 
    - Anonymous user login via Firebase Auth
    - Persistent authentication using AsyncStorage
- Real-Time Messaging
    - Messages stored in Firebase Firestore
    - Real time updates using onSnapshot
    - Automatic state synchronization
- Offline Support
    - Messages cached locally using Asyncstorage
    - Automatic fallback when offline
    - Firestore network automatically enabled/ disabled based on connection
- Media Sharing
    - Take pictures using device camera
    - Choose images from media library
    - Images uploaded to Firebase Cloud Storage 
    - Download URL saved in Firestore
- Location Sharing 
    - Fetch current divice location using Expo Location 
    - Display map preview in chat 
    - Marker placed at exact coordinates
    - Tap loaction preview to open in Google Maps
- UI Features
    - Custom background color selection
    - Styled chat bubbles
    - Responsive layout using flexbox 

## Set up instructions

Follow these steps to get the Chat App running locally on your machine:

Make sure you have installed: 
- Node.js
- npm
- Expo CLI

### Steps
**Clone the repository**  
   ```bash
   git clone https://github.com/annapgsm/chatApp.git
   cd chatApp
   ```
**Install dependencies** 
   ```bash
   npm install
```
**Start Expo development server**
  ```bash
npm start
 ```
 
**Run the app on:**
- Android Emulator
- iOS Simulator
- Physical device using Expo Go

## Firebase Configuration 

This project uses Firebase for:
- Firestore database
- Authentication
- Cloud Storage

The Firebase credentials are stored in: firebaseConfig.js

If you want to use your own Firebase project: 
1) Create new Firebase project 
2) Enable Firestore, Anonymous Authentication and Sorage 
3) Replace the credentials inside firebase.Config.js 

## Development & Testing

The app is run locally using Expo and tested on:
- Android Emulator
- iOS Simulator
- Physical devices via Expo Go

## User Stories

- As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my friends and family.
- As a user, I want to be able to send messages to my friends and family members to exchange the latest news.
- As a user, I want to send images to my friends to show them what I’m currently doing.
- As a user, I want to share my location with my friends to show them where I am.
- As a user, I want to be able to read my messages offline so I can reread conversations at any time.
- As a user with a visual impairment, I want to use a chat app that is compatible with a screen reader so that I can engage with a chat interface.

## What This Project Demonstrates

- Real-time data architecture
- Offline-first mobile development
- Native device API integration
- Cloud storage handling
- Network state management
- Clean React component structure
- Async/await and Promise handling
- Defensive data validation before database writes