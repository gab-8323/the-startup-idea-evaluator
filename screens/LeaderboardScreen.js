import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, LinearGradient } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDarkMode } from '../DarkModeContext';

export default function LeaderboardScreen({ navigation, route }) {
  const [topIdeas, setTopIdeas] = useState([]);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTopIdeas();
    });
    return unsubscribe;
  }, [navigation]);

  const loadTopIdeas = async () => {
    try {
      const storedIdeas = await AsyncStorage.getItem('ideas');
      const ideas = storedIdeas ? JSON.parse(storedIdeas) : [];
      const sorted = ideas.sort((a, b) => b.votes - a.votes).slice(0, 5);
      setTopIdeas(sorted);
    } catch (error) {
      console.error('Failed to load top ideas', error);
    }
  };

  const getBadge = (index) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `${index + 1}`;
    }
  };

  const renderItem = ({ item, index }) => (
    <Card style={[isDarkMode ? styles.cardDark : styles.card, styles[`card${index}`]]} key={item.id}>
      <View style={isDarkMode ? styles.cardHeaderDark : styles.cardHeader}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{getBadge(index)}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={isDarkMode ? styles.cardTitleDark : styles.cardTitle}>{item.startupName}</Text>
          <Text style={isDarkMode ? styles.cardSubtitleDark : styles.cardSubtitle}>{item.tagline}</Text>
        </View>
      </View>
      <Card.Content style={styles.cardContent}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name="star" size={20} color="#FFD700" />
            <Text style={isDarkMode ? styles.statTextDark : styles.statText}>{item.rating}/100</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialIcons name="thumb-up" size={20} color="#6200ee" />
            <Text style={isDarkMode ? styles.statTextDark : styles.statText}>{item.votes} votes</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={isDarkMode ? styles.containerDark : styles.container}>
      <View style={styles.headerContainer}>
        <MaterialIcons name="leaderboard" size={40} color="#6200ee" />
        <Title style={isDarkMode ? styles.titleDark : styles.title}>🏆 Top 5 Ideas</Title>
        <Text style={isDarkMode ? styles.subtitleDark : styles.subtitle}>The most popular startup concepts!</Text>
      </View>
      <FlatList
        data={topIdeas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    flex: 1,
    padding: 10,
    backgroundColor: '#121212',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    alignSelf: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 24,
    color: '#6200ee',
  },
  titleDark: {
    alignSelf: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 24,
    color: '#bb86fc',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  subtitleDark: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardHeaderDark: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  badgeContainer: {
    backgroundColor: '#6200ee',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardTitleDark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#bbb',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cardSubtitleDark: {
    fontSize: 14,
    color: '#bbb',
  },
  cardContent: {
    paddingVertical: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#444',
  },
  statTextDark: {
    marginLeft: 6,
    fontSize: 16,
    color: '#bbb',
  },
});
