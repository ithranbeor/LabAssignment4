import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, TextInput, Button, Modal, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vmaalvritikdvlyntzal.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtYWFsdnJpdGlrZHZseW50emFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4OTQ4NTAsImV4cCI6MjA0OTQ3MDg1MH0.YgcVk8H7x88i2Qs4JU9xQaJnqWD8IB4V7mJdfRZnc1c'
);

const Symptoms = () => {
  const [expandedDiseaseName, setExpandedDiseaseName] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [diseases, setDiseases] = useState([]);
  
  const [diseaseName, setDiseaseName] = useState('');
  const [diseaseDescription, setDiseaseDescription] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const symptomsList = [
    'Abdominal pain', 'Abnormal heartbeat', 'Blurred vision', 'Blood in stool or urine', 
    'Cough', 'Coughing up blood', 'Changes in urine color', 'Chest pain', 'Chest tightness', 
    'Chills', 'Cold extremities', 'Confusion or disorientation', 'Cyanosis (bluish tint to skin)', 
    'Diarrhea', 'Difficulty swallowing', 'Dizziness', 'Dry mouth', 'Dry or brittle hair or nails', 
    'Elevated blood pressure', 'Enlarged lymph nodes', 'Excessive thirst or hunger', 
    'Fainting or loss of consciousness', 'Fever', 'Frequent urination', 'Hair loss', 'Headache', 
    'Hearing loss', 'Hiccups', 'Increased sensitivity to pain', 'Itching', 'Jaundice', 'Joint pain', 
    'Loss of appetite', 'Memory loss or confusion', 'Muscle aches', 'Nausea', 'Night sweats', 
    'Paleness', 'Painful urination', 'Rash', 'Runny or stuffy nose', 'Seizures', 'Sensitivity to light', 
    'Shortness of breath', 'Sore muscles or body aches', 'Sore throat', 'Swelling', 'Tingling or numbness', 
    'Unexplained bruising', 'Vomiting', 'Weight loss'
  ];
  

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

  const handleFormSubmit = async () => {
    if (!diseaseName || !diseaseDescription || selectedSymptoms.length === 0) {
      alert('Please fill in all fields');
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from('add_disease')
        .insert([{
          diseaseName,
          diseaseDescription,
          symptoms: selectedSymptoms.join(', '),
        }]);
  
      if (error) {
        console.error('Error submitting data:', error.message);
        return;
      }
  
      alert('Disease information submitted successfully');
      setDiseaseName('');
      setDiseaseDescription('');
      setSelectedSymptoms([]);
      getDiseaseSymptoms(); 
    } catch (err) {
      console.error('Error submitting disease data:', err);
    }
  };

  useEffect(() => {
    getDiseaseSymptoms();
  }, []);

  const filteredData = diseases.filter(disease => 
    disease.diseaseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDescription = (diseaseName) => {
    setExpandedDiseaseName(expandedDiseaseName === diseaseName ? null : diseaseName);
  };

  const handleSymptomToggle = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(item => item !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#5A8EE0" />
      </TouchableOpacity>

      <Text style={styles.header}>Add New</Text>

      <TextInput
        style={styles.input}
        placeholder="Disease Name"
        value={diseaseName}
        onChangeText={setDiseaseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Disease Description"
        value={diseaseDescription}
        onChangeText={setDiseaseDescription}
      />
      
      <TouchableOpacity onPress={toggleModal}>
        <Text style={styles.symptomText}>Select Symptoms (Tap to open)</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search symptoms"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <ScrollView>
              {symptomsList
                .filter((symptom) => symptom.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((symptom, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.symptomItem,
                      selectedSymptoms.includes(symptom) && styles.selectedSymptom
                    ]}
                    onPress={() => handleSymptomToggle(symptom)}
                  >
                    <Text style={styles.symptomText}>{symptom}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <Button title="Done" onPress={toggleModal} />
          </View>
        </View>
      </Modal>

      <View style={styles.selectedSymptomsContainer}>
        {selectedSymptoms.map((symptom, index) => (
          <View key={index} style={styles.selectedSymptomItem}>
            <Text style={styles.selectedSymptomText}>{symptom}</Text>
          </View>
        ))}
      </View>

      <Button title="Submit" onPress={handleFormSubmit} />
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
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
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
  formHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  symptomItem: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedSymptom: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  selectedSymptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  selectedSymptomItem: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedSymptomText: {
    color: '#fff',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  searchInput: {
    height: 40, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingLeft: 10, 
    marginBottom: 10, 
    fontSize: 16, 
  }
  
});

export default Symptoms;
