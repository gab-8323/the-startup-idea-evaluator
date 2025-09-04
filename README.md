# Startup Idea Evaluator

A React Native app built with Expo for evaluating and voting on startup ideas.

## Features

- Submit startup ideas with name, tagline, and description
- AI-powered rating simulation
- List and sort ideas by rating or votes
- Upvote ideas (one vote per idea per user)
- Leaderboard of top 5 ideas
- Dark mode support
- Responsive UI with React Native Paper

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the App

### Development
```bash
npx expo start
```

### Android
```bash
npx expo start --android
```

### iOS
```bash
npx expo start --ios
```

### Web
```bash
npx expo start --web
```

## Building for Production

### Using Expo Application Services (EAS)
1. Install EAS CLI:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. Login to Expo:
   ```bash
   eas login
   ```

3. Build for Android:
   ```bash
   eas build --platform android
   ```

4. Build for iOS:
   ```bash
   eas build --platform ios
   ```

### Manual Build
For manual builds, follow Expo documentation for building APKs or IPAs.

## Deployment

1. Build the app using EAS as above
2. Submit to Google Play Store or Apple App Store
3. For web deployment, use `expo export` and deploy to a static hosting service

## Technologies Used

- React Native
- Expo
- React Navigation
- React Native Paper
- AsyncStorage
- React Native Gesture Handler

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
