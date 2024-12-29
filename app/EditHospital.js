import React, { useState, useEffect } from 'react';
import {View,Text,StyleSheet,Image,ScrollView,TouchableOpacity,TextInput,Alert,} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import * as ImagePicker from 'expo-image-picker';

const HospitalProfile = () => {
  const [hospital, setHospital] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedHospital, setUpdatedHospital] = useState({});
  const { hospitalId } = useLocalSearchParams();
  const router = useRouter();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'You need to grant access to your media library.');
      }
    };
    getPermission();
  }, []);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      const { data, error } = await supabase
        .from('hospitalregistration')
        .select('*')
        .eq('registration_id', hospitalId)
        .single();

      if (error) {
        console.error('Error fetching hospital details:', error.message);
      } else {
        setHospital(data);
        setUpdatedHospital(data);
      }
    };

    if (hospitalId) {
      fetchHospitalDetails();
    }
  }, [hospitalId]);

  const handleSave = async () => {
    const { data, error } = await supabase
      .from('hospitalregistration')
      .update(updatedHospital)
      .eq('registration_id', hospitalId);

    if (error) {
      console.error('Error updating hospital:', error.message);
      alert('Failed to save changes.');
    } else {
      setHospital(data[0]);
      setIsEditing(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const file = result.assets[0].uri;
      setUpdatedHospital({ ...updatedHospital, image_url: file });
    }
  };

  const handleDeletePhoto = async () => {
    const { error } = await supabase
      .from('hospitalregistration')
      .update({ image_url: null })
      .eq('registration_id', hospitalId);

    if (error) {
      console.error('Error deleting photo:', error.message);
      alert('Failed to delete photo.');
    } else {
      setUpdatedHospital({ ...updatedHospital, image_url: null });
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  if (!hospital) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>Hospital Profile</Text>
      </View>

      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={isEditing ? handleImagePick : null}>
          {updatedHospital.image_url ? (
            <Image source={{ uri: updatedHospital.image_url }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>No Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {isEditing && updatedHospital.image_url && (
          <TouchableOpacity onPress={handleDeletePhoto} style={styles.deletePhotoButton}>
            <MaterialCommunityIcons name="delete" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Registration ID</Text>
          {isEditing ? (
            <Text style={styles.infoValue}>{hospital?.registration_id || 'None'}</Text>
          ) : (
            <Text style={styles.infoValue}>{hospital.registration_id || 'None'}</Text>
          )}
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Hospital Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.infoValue}
              value={updatedHospital.hospital_name}
              onChangeText={(text) => setUpdatedHospital({ ...updatedHospital, hospital_name: text })}
            />
          ) : (
            <Text style={styles.infoValue}>{hospital.hospital_name}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Location</Text>
          {isEditing ? (
            <TextInput
              style={styles.infoValue}
              value={updatedHospital.location}
              onChangeText={(text) => setUpdatedHospital({ ...updatedHospital, location: text })}
            />
          ) : (
            <Text style={styles.infoValue}>{hospital.location}</Text>
          )}
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Contact Person</Text>
          {isEditing ? (
            <TextInput
              style={styles.infoValue}
              value={updatedHospital.name}
              onChangeText={(text) => setUpdatedHospital({ ...updatedHospital, name: text })}
            />
          ) : (
            <Text style={styles.infoValue}>{hospital.name}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Position</Text>
          {isEditing ? (
            <TextInput
              style={styles.infoValue}
              value={updatedHospital.position}
              onChangeText={(text) => setUpdatedHospital({ ...updatedHospital, position: text })}
            />
          ) : (
            <Text style={styles.infoValue}>{hospital.position}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.infoValue}
              value={updatedHospital.email}
              onChangeText={(text) => setUpdatedHospital({ ...updatedHospital, email: text })}
            />
          ) : (
            <Text style={styles.infoValue}>{hospital.email}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Contact Number</Text>
          {isEditing ? (
            <TextInput
              style={styles.infoValue}
              value={updatedHospital.contact_number}
              onChangeText={(text) => setUpdatedHospital({ ...updatedHospital, contact_number: text })}
            />
          ) : (
            <Text style={styles.infoValue}>{hospital.contact_number}</Text>
          )}
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Description</Text>
          {isEditing ? (
            <TextInput
              style={styles.infoValue}
              value={updatedHospital.description}
              onChangeText={(text) => setUpdatedHospital({ ...updatedHospital, description: text })}
            />
          ) : (
            <Text style={styles.infoValue}>{hospital.description}</Text>
          )}
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Specializations</Text>
          {isEditing ? (
            <TextInput
              style={styles.infoValue}
              value={updatedHospital.specializations}
              onChangeText={(text) => setUpdatedHospital({ ...updatedHospital, specializations: text })}
            />
          ) : (
            <Text style={styles.infoValue}>{hospital.specializations}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={() => setIsEditing(true)}>
        <Text style={styles.saveText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>

      {showSuccessMessage && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Changes saved successfully!</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
  },
  headerContainer: {
    backgroundColor: '#628bf8',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  profileImage: {
    width: 400,  
    height: 300, 
    borderRadius: 15, 
  },
  imagePlaceholder: {
    width: 400,  
    height: 300, 
    borderRadius: 15,  
    backgroundColor: '#dcdcdc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: '#fff',
    fontSize: 14,  
  },
  deletePhotoButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#ff5c5c',
    borderRadius: 50,
    padding: 5,
  },
  infoContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7a7a7a',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 5,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#5A8EE0',
    borderRadius: 30,
    paddingVertical: 12,
    width: '80%',
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  successMessage: {
    marginTop: 20,
    backgroundColor: '#5A8EE0',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    alignItems: 'center',
  },
  successText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
});

export default HospitalProfile;
