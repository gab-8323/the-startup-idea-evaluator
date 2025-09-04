import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, TextInput as RNTextInput, Modal, KeyboardAvoidingView, Platform, LinearGradient } from 'react-native';
import { Button, Text, Title, Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDarkMode } from '../DarkModeContext';

export default function IdeaSubmissionScreen({ navigation, route }) {
  const [startupName, setStartupName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { isDarkMode } = useDarkMode();

  const generateFakeRating = () => {
    const rating = Math.floor(Math.random() * 101);
    let feedback = '';

    if (rating >= 90) {
      feedback = '🚀 "This idea is absolutely brilliant! You\'re onto something huge!"';
    } else if (rating >= 80) {
      feedback = '💡 "Wow! This has serious potential. Investors would love this!"';
    } else if (rating >= 70) {
      feedback = '👍 "Solid concept! With some polish, this could be a winner."';
    } else if (rating >= 60) {
      feedback = '🤔 "Interesting idea. It needs some work, but there\'s potential."';
    } else if (rating >= 50) {
      feedback = '😐 "Not bad, but it\'s been done before. Think of a twist!"';
    } else if (rating >= 40) {
      feedback = '😅 "Hmm... This might need a complete rethink. Keep brainstorming!"';
    } else if (rating >= 30) {
      feedback = '🤨 "This idea has some holes. Maybe pivot to something else?"';
    } else if (rating >= 20) {
      feedback = '😬 "Oof, this needs major improvements. What\'s your backup plan?"';
    } else if (rating >= 10) {
      feedback = '😱 "This is... creative? Maybe try a different approach entirely."';
    } else {
      feedback = '💀 "Even AI couldn\'t find anything positive here. Time for Plan B!"';
    }

    return { rating, feedback };
  };

  const saveIdea = async () => {
    if (!startupName.trim() || !tagline.trim() || !description.trim()) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }

    try {
      const aiRating = generateFakeRating();
      const newIdea = {
        id: Date.now().toString(),
        startupName,
        tagline,
        description,
        rating: aiRating.rating,
        feedback: aiRating.feedback,
        votes: 0,
      };

      const storedIdeas = await AsyncStorage.getItem('ideas');
      const ideas = storedIdeas ? JSON.parse(storedIdeas) : [];
      ideas.push(newIdea);
      await AsyncStorage.setItem('ideas', JSON.stringify(ideas));

      // Show success message
      setSnackbarMessage(`🎉 AI Rating: ${aiRating.rating}/100\n${aiRating.feedback}`);
      setSnackbarVisible(true);

      // Hide the snackbar after 1 second
      setTimeout(() => {
        setSnackbarVisible(false);
      }, 1000);

      // Clear form
      setStartupName('');
      setTagline('');
      setDescription('');

      // Navigate to ideas list after a short delay to show the message
      setTimeout(() => {
        navigation.navigate('IdeaListing');
      }, 2000);

    } catch (error) {
      Alert.alert('Error', 'Failed to save idea');
    }
  };

  return (
    <View style={isDarkMode ? styles.containerDark : styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <MaterialIcons name="lightbulb" size={48} color="#FFD700" />
            <Title style={isDarkMode ? styles.titleDark : styles.title}>Submit Your Startup Idea</Title>
            <Text style={isDarkMode ? styles.subtitleDark : styles.subtitle}>Let our AI evaluate your brilliant concept!</Text>
          </View>

          <Card style={isDarkMode ? styles.formCardDark : styles.formCard}>
            <Card.Content>
              <View style={styles.inputContainer}>
                <MaterialIcons name="business" size={24} color="#6200ee" style={styles.inputIcon} />
                <View style={styles.inputWrapper}>
                  <Text style={isDarkMode ? styles.labelDark : styles.label}>Startup Name</Text>
                  <RNTextInput
                    value={startupName}
                    onChangeText={setStartupName}
                    style={isDarkMode ? styles.rnInputDark : styles.rnInput}
                    placeholder="Enter your startup name"
                    placeholderTextColor={isDarkMode ? "#888" : "#999"}
                    autoCapitalize="words"
                    autoCorrect={true}
                    returnKeyType="next"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="tag" size={24} color="#6200ee" style={styles.inputIcon} />
                <View style={styles.inputWrapper}>
                  <Text style={isDarkMode ? styles.labelDark : styles.label}>Tagline</Text>
                  <RNTextInput
                    value={tagline}
                    onChangeText={setTagline}
                    style={isDarkMode ? styles.rnInputDark : styles.rnInput}
                    placeholder="Enter a catchy tagline"
                    placeholderTextColor={isDarkMode ? "#888" : "#999"}
                    autoCapitalize="sentences"
                    autoCorrect={true}
                    returnKeyType="next"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="description" size={24} color="#6200ee" style={styles.inputIcon} />
                <View style={styles.inputWrapper}>
                  <Text style={isDarkMode ? styles.labelDark : styles.label}>Description</Text>
                  <RNTextInput
                    value={description}
                    onChangeText={setDescription}
                    style={isDarkMode ? styles.rnTextAreaDark : styles.rnTextArea}
                    placeholder="Describe your startup idea in detail"
                    placeholderTextColor={isDarkMode ? "#888" : "#999"}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    autoCapitalize="sentences"
                    autoCorrect={true}
                    returnKeyType="done"
                  />
                </View>
              </View>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={saveIdea}
            style={styles.submitButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="send"
          >
            Get AI Feedback
          </Button>
        </View>
      </ScrollView>

      <Modal
        visible={snackbarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSnackbarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={isDarkMode ? styles.modalContentDark : styles.modalContent}>
            <Text style={isDarkMode ? styles.modalTextDark : styles.modalText}>
              {snackbarMessage}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContainerDark: {
    flex: 1,
    backgroundColor: '#121212',
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  titleDark: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  subtitleDark: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginTop: 5,
  },
  formCard: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 12,
    marginBottom: 30,
  },
  formCardDark: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderRadius: 12,
    marginBottom: 30,
    backgroundColor: '#1e1e1e',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  labelDark: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#fff',
  },
  rnInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rnInputDark: {
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#2a2a2a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    color: '#fff',
  },
  rnTextArea: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 120,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rnTextAreaDark: {
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#2a2a2a',
    height: 120,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    color: '#fff',
  },
  submitButton: {
    borderRadius: 25,
    paddingVertical: 8,
    backgroundColor: '#6200ee',
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: '90%',
    maxWidth: 400,
  },
  modalContentDark: {
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: '90%',
    maxWidth: 400,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalTextDark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
});
