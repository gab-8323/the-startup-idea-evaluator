# Startup Idea Evaluator Documentation

## Overview
Startup Idea Evaluator is a React Native app built with Expo that allows users to submit startup ideas, get AI-powered ratings, vote on ideas, and view leaderboards. It supports dark mode and provides a responsive UI.

## Features
- Submit startup ideas with name, tagline, and description
- AI-powered rating simulation with feedback
- List and sort ideas by rating or votes
- Upvote ideas (one vote per idea per user)
- Leaderboard of top 5 ideas based on votes
- Dark mode support
- Share and copy ideas
- Delete ideas

## Architecture
- Built with React Native and Expo
- Navigation handled by React Navigation's native stack
- UI components from React Native Paper
- State management using React hooks and Context API for dark mode
- Data persistence using AsyncStorage for ideas and votes
- Gesture handling with react-native-gesture-handler for swipe actions

## Screens
### Idea Submission Screen
- Form to submit startup idea details
- Generates a fake AI rating and feedback
- Saves ideas to AsyncStorage

### Idea Listing Screen
- Displays list of submitted ideas
- Supports sorting by rating or votes
- Allows upvoting, sharing, copying, and deleting ideas
- Swipe gestures for quick actions

### Leaderboard Screen
- Shows top 5 ideas by votes
- Displays badges for top 3 ideas

## Dark Mode
- Dark mode state managed via Context API
- Preference saved in AsyncStorage
- UI themes switch dynamically

## Data Model
- Idea object:
  - id: string (timestamp)
  - startupName: string
  - tagline: string
  - description: string
  - rating: number (0-100)
  - feedback: string
  - votes: number

## Setup and Running
- Clone the repo
- Run `npm install`
- Start with `npx expo start`
- Build with Expo Application Services (EAS)

## Contribution Guidelines
- Fork the repo
- Create feature branch
- Make changes and test
- Submit pull request

## Contact
For questions or support, open an issue on GitHub.
