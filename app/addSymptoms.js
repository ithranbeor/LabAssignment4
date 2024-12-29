import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
import { Button, TextInput as PaperInput, DefaultTheme, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vmaalvritikdvlyntzal.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtYWFsdnJpdGlrZHZseW50emFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4OTQ4NTAsImV4cCI6MjA0OTQ3MDg1MH0.YgcVk8H7x88i2Qs4JU9xQaJnqWD8IB4V7mJdfRZnc1c'
);

const AddSymptoms = () => {
  const [symptomName, setSymptomName] = useState('');
  const [symptomDescription, setSymptomDescription] = useState('');
  const [symptomsList, setSymptomsList] = useState([]);
  const [expandedSymptomId, setExpandedSymptomId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchSymptoms = async () => {
    try {
      const { data, error } = await supabase
        .from('add_symptoms')
        .select('symptoms_id, symptomsName, symptomsDescription');

      if (error) {
        Alert.alert('Error', 'Failed to fetch symptoms');
        return;
      }

      setSymptomsList(data);
    } catch (err) {
      console.error('Error fetching symptoms:', err);
      Alert.alert('Error', 'Failed to fetch symptoms');
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, []);

 
  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 10); 
  };

  const handleSave = async () => {
    if (!symptomName || !symptomDescription) {
      Alert.alert('Error', 'Please enter symptom name and description');
      return;
    }

    try {
      const randomId = generateRandomId(); 

      const { data, error } = await supabase
        .from('add_symptoms')
        .insert([{ symptoms_id: randomId, symptomsName: symptomName, symptomsDescription: symptomDescription }]);

      if (error) {
        console.error('Error inserting symptom:', error.message);
        Alert.alert('Error', `Failed to save symptom: ${error.message}`);
        return;
      }

      fetchSymptoms();

      setSymptomName('');
      setSymptomDescription('');

      Alert.alert('Symptom Added', `Symptom: ${symptomName}\nDescription: ${symptomDescription}`);
    } catch (err) {
      console.error('Error saving symptom:', err);
      Alert.alert('Error', 'Failed to save symptom');
    }
  };

  const toggleDescription = (id) => {
    setExpandedSymptomId(expandedSymptomId === id ? null : id);
  };

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: 'black',
    },
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => {
          setIsAuthenticated(false); 
          router.back('/admin');
        }}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#5A8EE0" />
      </TouchableOpacity>

      <PaperInput
        style={styles.input}
        label="Symptom Name"
        value={symptomName}
        onChangeText={setSymptomName}
        theme={customTheme}
      />
      <PaperInput
        style={[styles.input, { height: 100 }]}
        label="Symptom Description"
        value={symptomDescription}
        onChangeText={setSymptomDescription}
        theme={customTheme}
        multiline
      />
      <Button mode="contained" style={styles.button} onPress={handleSave}>
        Save Symptom
      </Button>

      <Text style={styles.title}>Symptoms from Database</Text>

      <FlatList
        data={symptomsList}
        keyExtractor={(item) => item.symptoms_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.symptomItem}>
            <TouchableOpacity onPress={() => toggleDescription(item.symptoms_id)}>
              <Text style={styles.symptomName}>{item.symptomsName}</Text>
            </TouchableOpacity>
            {expandedSymptomId === item.symptoms_id && (
              <Text style={styles.symptomDescription}>{item.symptomsDescription}</Text>
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
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  input: {
    backgroundColor: '#E8EAF6',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#8A8AFF',
  },
  symptomItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8A8AFF',
    fontWeight: 'bold',
  },
  symptomDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
});

export default AddSymptoms;
