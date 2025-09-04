import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Share, Clipboard, Modal, Alert } from 'react-native';
import { Text, Button, Card, Menu } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDarkMode } from '../DarkModeContext';
import { Swipeable } from 'react-native-gesture-handler';


export default function IdeaListingScreen({ navigation, route }) {
  const [ideas, setIdeas] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [sortBy, setSortBy] = useState('rating');
  const [menuVisible, setMenuVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [votedIds, setVotedIds] = useState([]);
  const { isDarkMode } = useDarkMode();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadIdeas();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (snackbarVisible) {
      const timer = setTimeout(() => setSnackbarVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [snackbarVisible]);

  const loadIdeas = async () => {
    try {
      const storedIdeas = await AsyncStorage.getItem('ideas');
      const ideas = storedIdeas ? JSON.parse(storedIdeas) : [];
      setIdeas(sortIdeas(ideas, sortBy));
      const votedIdsStr = await AsyncStorage.getItem('votedIds');
      const votedIds = votedIdsStr ? JSON.parse(votedIdsStr) : [];
      setVotedIds(votedIds);
    } catch (error) {
      console.error('Failed to load ideas', error);
    }
  };

  const sortIdeas = (ideas, criterion) => {
    const sorted = [...ideas];
    if (criterion === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (criterion === 'votes') {
      sorted.sort((a, b) => b.votes - a.votes);
    }
    return sorted;
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const upvoteIdea = async (id) => {
    try {
      if (votedIds.includes(id)) {
        setSnackbarMessage('You have already voted for this idea.');
        setSnackbarVisible(true);
        return;
      }
  
      const updatedIdeas = ideas.map((idea) => {
        if (idea.id === id) {
          return { ...idea, votes: idea.votes + 1 };
        }
        return idea;
      });
  
      const updatedVotedIds = [...votedIds, id];
  
      await AsyncStorage.setItem('ideas', JSON.stringify(updatedIdeas));
      await AsyncStorage.setItem('votedIds', JSON.stringify(updatedVotedIds));
      setIdeas(sortIdeas(updatedIdeas, sortBy));
      setVotedIds(updatedVotedIds);
      setSnackbarMessage('Vote recorded!');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Failed to upvote', error);
      setSnackbarMessage('Failed to record vote.');
      setSnackbarVisible(true);
    }
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const changeSort = (criterion) => {
    setSortBy(criterion);
    setIdeas(sortIdeas(ideas, criterion));
    closeMenu();
  };

  const shareIdea = async (idea) => {
    try {
      const shareMessage = `🚀 Check out this startup idea!\n\n${idea.startupName}\n"${idea.tagline}"\n\nRating: ${idea.rating}/100\nVotes: ${idea.votes}\n\n${idea.description}\n\nShared from Startup Idea Evaluator`;

      const result = await Share.share({
        message: shareMessage,
        title: `Check out ${idea.startupName}`,
      });

      if (result.action === Share.sharedAction) {
        setSnackbarMessage('Idea shared successfully!');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Error sharing idea:', error);
      setSnackbarMessage('Failed to share idea.');
      setSnackbarVisible(true);
    }
  };

  const copyToClipboard = async (idea) => {
    try {
      const copyText = `${idea.startupName}\n"${idea.tagline}"\n\nRating: ${idea.rating}/100\nVotes: ${idea.votes}\n\n${idea.description}`;
      await Clipboard.setString(copyText);
      setSnackbarMessage('Idea copied to clipboard!');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      setSnackbarMessage('Failed to copy to clipboard.');
      setSnackbarVisible(true);
    }
  };

  const deleteIdea = (id) => {
    Alert.alert(
      'Delete Idea',
      'Are you sure you want to delete this idea?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedIdeas = ideas.filter((idea) => idea.id !== id);
              await AsyncStorage.setItem('ideas', JSON.stringify(updatedIdeas));
              setIdeas(updatedIdeas);
              setSnackbarMessage('Idea deleted successfully!');
              setSnackbarVisible(true);
            } catch (error) {
              console.error('Error deleting idea:', error);
              setSnackbarMessage('Failed to delete idea.');
              setSnackbarVisible(true);
            }
          },
        },
      ]
    );
  };





  const renderLeftActions = (item) => (
    <View style={styles.leftAction}>
      <TouchableOpacity
        style={styles.actionButtonSwipe}
        onPress={() => shareIdea(item)}
      >
        <MaterialIcons name="share" size={24} color="#fff" />
        <Text style={styles.actionText}>Share</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRightActions = (item) => (
    <View style={styles.rightAction}>
      <TouchableOpacity
        style={styles.deleteButtonSwipe}
        onPress={() => deleteIdea(item.id)}
      >
        <MaterialIcons name="delete" size={24} color="#fff" />
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Swipeable
      renderLeftActions={() => renderLeftActions(item)}
      renderRightActions={() => renderRightActions(item)}
      leftThreshold={80}
      rightThreshold={80}
    >
      <Card style={isDarkMode ? styles.cardDark : styles.card} key={item.id}>
        <Card.Title
          title={item.startupName}
          subtitle={item.tagline}
          titleStyle={isDarkMode ? { color: '#fff' } : {}}
          subtitleStyle={isDarkMode ? { color: '#bbb' } : {}}
          right={() => (
            <Button onPress={() => upvoteIdea(item.id)} style={styles.actionButton}>
              <MaterialIcons
                name="thumb-up"
                size={20}
                color={votedIds.includes(item.id) ? '#f44336' : '#fff'}
              />
              {' '}Upvote
            </Button>
          )}
        />
        <Card.Content>
          <Text style={isDarkMode ? { color: '#fff' } : {}}>Rating: {item.rating}/100</Text>
          <Text style={isDarkMode ? styles.feedbackTextDark : styles.feedbackText}>{item.feedback}</Text>
          <Text style={isDarkMode ? { color: '#fff' } : {}}>Votes: {item.votes}</Text>
          <TouchableOpacity onPress={() => toggleExpand(item.id)}>
            <Text style={isDarkMode ? styles.readMoreDark : styles.readMore}>
              {expandedId === item.id ? 'Read less' : 'Read more'}
            </Text>
          </TouchableOpacity>
          {expandedId === item.id && <Text style={isDarkMode ? { color: '#fff' } : {}}>{item.description}</Text>}
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => shareIdea(item)} style={styles.shareButton}>
            <MaterialIcons name="share" size={16} color="#fff" />
            {' '}Share
          </Button>
          <Button onPress={() => copyToClipboard(item)} style={styles.copyButton}>
            <MaterialIcons name="content-copy" size={16} color="#fff" />
            {' '}Copy
          </Button>
          <Button onPress={() => deleteIdea(item.id)} style={styles.deleteButton}>
            <MaterialIcons name="delete" size={16} color="#fff" />
            {' '}Delete
          </Button>
        </Card.Actions>
      </Card>
    </Swipeable>
  );

  return (
    <View style={isDarkMode ? styles.containerDark : styles.container}>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Button onPress={openMenu} mode="outlined" style={isDarkMode ? styles.sortButtonDark : styles.sortButton}>
            Sort by: {sortBy}
          </Button>
        }
      >
        <Menu.Item onPress={() => changeSort('rating')} title="Rating" />
        <Menu.Item onPress={() => changeSort('votes')} title="Votes" />
      </Menu>
      <FlatList
        data={ideas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <Button
        mode="contained"
        onPress={() => navigation.navigate('IdeaSubmission')}
        style={styles.submitButton}
      >
        Submit New Idea
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Leaderboard')}
        style={styles.leaderboardButton}
      >
        View Leaderboard
      </Button>

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
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  containerDark: {
    flex: 1,
    padding: 10,
    backgroundColor: '#121212',
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardDark: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: '#1e1e1e',
  },
  feedbackText: {
    fontStyle: 'italic',
    color: '#555',
    marginTop: 6,
    marginBottom: 6,
    fontSize: 14,
  },
  feedbackTextDark: {
    fontStyle: 'italic',
    color: '#bbb',
    marginTop: 6,
    marginBottom: 6,
    fontSize: 14,
  },
  readMore: {
    color: '#6200ee',
    marginTop: 5,
    marginBottom: 5,
    fontWeight: '600',
  },
  readMoreDark: {
    color: '#bb86fc',
    marginTop: 5,
    marginBottom: 5,
    fontWeight: '600',
  },
  sortButton: {
    marginBottom: 10,
  },
  sortButtonDark: {
    marginBottom: 10,
    backgroundColor: '#2a2a2a',
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#6200ee',
    borderRadius: 25,
    elevation: 4,
  },
  leaderboardButton: {
    marginTop: 10,
    backgroundColor: '#03dac6',
    borderRadius: 25,
    elevation: 4,
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
  actionButton: {
    marginRight: 8,
    backgroundColor: '#03A9F4',
    borderWidth: 1,
    borderColor: '#fff',
  },
  shareButton: {
    marginRight: 8,
    backgroundColor: '#03dac6',
  },
  copyButton: {
    marginRight: 8,
    backgroundColor: '#ff9800',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  leftAction: {
    backgroundColor: '#03dac6',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
    marginBottom: 12,
  },
  rightAction: {
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonSwipe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonSwipe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
