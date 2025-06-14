import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, Image } from 'react-native';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import Lottie from 'lottie-react';

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);

  const searchMovies = async (text) => {
    setQuery(text);
    if (text.length < 3) return;
    try {
      const res = await axios.get(`https://www.omdbapi.com/?apikey=91a5e490&s=${text}`);
      setMovies(res.data.Search || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🎬 Movie Search</Text>

      {/* 🎞️ Movie animation */}
      <Lottie
  animationData={require('../assets/animations/movie.json')}
  loop
  autoplay
  style={styles.lottie}
/>



      <TextInput
        style={styles.search}
        placeholder="Search movies..."
        value={query}
        placeholderTextColor="#999"
        onChangeText={searchMovies}
      />

      <FlatList
        data={movies}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <MovieCard
            title={item.Title}
            poster={item.Poster}
            onPress={() => navigation.navigate('Details', { imdbID: item.imdbID })}
          />
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  search: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  lottie: {
    height: 150,
    alignSelf: 'center',
    marginBottom: 10,
  },
});
