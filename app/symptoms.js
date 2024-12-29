import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { createClient } from '@supabase/supabase-js';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const supabase = createClient(
  'https://vmaalvritikdvlyntzal.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtYWFsdnJpdGlrZHZseW50emFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4OTQ4NTAsImV4cCI6MjA0OTQ3MDg1MH0.YgcVk8H7x88i2Qs4JU9xQaJnqWD8IB4V7mJdfRZnc1c'
);

const Symptoms = () => {
  const [expandedDiseaseName, setExpandedDiseaseName] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [diseases, setDiseases] = useState([]);

  const getDiseaseSymptoms = async () => {
    try {
      const { data, error } = await supabase
        .from('add_disease')
        .select('disease_id, diseaseName, diseaseDescription, symptoms');

      if (error) {
        console.error('Error fetching data:', error.message);
        return;
      }

      setDiseases(data);
    } catch (err) {
      console.error('Error fetching disease data:', err);
    }
  };

  useEffect(() => {
    getDiseaseSymptoms();
  }, []);

  const filteredData = diseases.filter(disease => 
    disease.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    disease.symptoms.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDescription = (diseaseName) => {
    setExpandedDiseaseName(expandedDiseaseName === diseaseName ? null : diseaseName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => {
          router.back();
        }}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#5A8EE0" />
      </TouchableOpacity>

      <Text style={styles.header}>MediSease</Text>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search symptoms or disease"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Text style={styles.instructionText}>Click each box to see more symptoms</Text>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.disease_id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleDescription(item.diseaseName)}>
              <Text style={styles.diseaseTitle}>
                {item.diseaseName}{' '}
                {expandedDiseaseName === item.diseaseName ? '' : ''}
              </Text>
            </TouchableOpacity>
            {expandedDiseaseName === item.diseaseName && (
              <View>
                <Text style={styles.diseaseDescription}>{item.diseaseDescription}</Text>
                <Text style={styles.symptomText}>Symptoms: {item.symptoms}</Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F0FF',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backIcon: {
    position: 'absolute',
    top: 10,
    left: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  instructionText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    color: '#777',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 14,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 4,
  },
  diseaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3D3BFF',
  },
  diseaseDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  symptomText: {
    fontSize: 14,
    color: '#333',
  },
});

export default Symptoms;
