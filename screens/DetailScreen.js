import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailScreen({ route }) {
  const { imdbID } = route.params;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios
      .get(`https://www.omdbapi.com/?apikey=91a5e490&i=${imdbID}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error("Failed to fetch movie details:", err));
  }, []);

  const saveToFavorites = async () => {
    try {
      const existing = await AsyncStorage.getItem('favorites');
      let favorites = existing ? JSON.parse(existing) : [];

      if (!favorites.find(m => m.imdbID === movie.imdbID)) {
        favorites.push(movie);
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        Alert.alert('✅ Success', 'Saved to favorites!');
      } else {
        Alert.alert('ℹ️ Info', 'Already in favorites.');
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Could not save to favorites.');
      console.error("AsyncStorage error:", error);
    }
  };

  if (!movie) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading movie details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300' }}
        style={styles.poster}
      />
      <Text style={styles.title}>{movie.Title}</Text>
      <Text>Year: {movie.Year}</Text>
      <Text>Genre: {movie.Genre}</Text>
      <Text>IMDB Rating: {movie.imdbRating}</Text>
      <Button title="Save to Favorites" onPress={saveToFavorites} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  poster: { width: 200, height: 300, alignSelf: 'center', marginBottom: 15 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
});
