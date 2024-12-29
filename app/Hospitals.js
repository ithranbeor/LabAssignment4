import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchHospitals = async () => {
      const { data, error } = await supabase
        .from('hospitalregistration')
        .select('registration_id, hospital_name, image_url, specializations')
        .order('hospital_name', { ascending: true });

      if (error) {
        console.error('Error fetching hospitals:', error.message);
      } else {
        setHospitals(data);
        setFilteredHospitals(data);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredHospitals(hospitals);
    } else {
      const filtered = hospitals.filter(
        (hospital) =>
          hospital.hospital_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (hospital.specializations &&
            hospital.specializations
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
      setFilteredHospitals(filtered);
    }
  }, [searchQuery, hospitals]);

  const handleHospitalClick = (hospitalId) => {
    router.push({
      pathname: './HospitalProfile',
      params: { hospitalId },
    });
  };

  const handleDeleteHospital = async (hospitalId) => {
    Alert.alert(
      'Delete Hospital',
      'Are you sure you want to delete this hospital?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('hospitalregistration')
                .delete()
                .eq('registration_id', hospitalId);

              if (error) throw error;

              Alert.alert('Success', 'Hospital deleted successfully.');

              setHospitals((prev) =>
                prev.filter((hospital) => hospital.registration_id !== hospitalId)
              );
            } catch (error) {
              Alert.alert('Error', `Failed to delete hospital: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const handleEditHospital = (hospitalId) => {
    router.push({
      pathname: './EditHospital',
      params: { hospitalId },
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.hospitalCard}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => handleHospitalClick(item.registration_id)}
      >
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.hospitalImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>No Image</Text>
          </View>
        )}
        <View>
          <Text style={styles.hospitalName}>{item.hospital_name}</Text>
          {item.specializations && (
            <Text style={styles.specializations}>
              Specializations: {item.specializations}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditHospital(item.registration_id)}
        >
          <MaterialCommunityIcons name="pencil" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteHospital(item.registration_id)}
        >
          <MaterialCommunityIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
      <Text style={styles.header}>Hospital List</Text>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Hospital"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredHospitals}
        keyExtractor={(item) => item.registration_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F0FF',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
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
  listContainer: {
    paddingBottom: 20,
  },
  hospitalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginVertical: 5,
  },
  hospitalImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 15,
  },
  imageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  hospitalName: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  specializations: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    marginHorizontal: 5,
  },
});

export default HospitalList;
