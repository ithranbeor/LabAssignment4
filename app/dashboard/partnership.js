import React, { useState } from 'react';
import {View,Text,StyleSheet,Alert,Image,TouchableOpacity,ScrollView,FlatList,Modal} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FormScreen = () => {
  const [specializations, setSpecializations] = useState([]);
  const [hospitalName, setHospitalName] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  const [hospitalImage, setHospitalImage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const specializationOptions = [
    'Cardiology',
    'Neurology',
    'Orthopedic Surgery',
    'Pediatrics',
    'Radiology',
    'General Surgery',
    'Dermatology',
    'Oncology',
    'Psychiatry',
    'Urology',
  ];

  const toggleSpecialization = (item) => {
    setSpecializations((prev) =>
      prev.includes(item)
        ? prev.filter((specialization) => specialization !== item)
        : [...prev, item]
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setHospitalImage(result.assets[0].uri);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validateContactNumber = (number) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(number);
  };

  const handleSave = async () => {
    if (!hospitalName || !location || !name || !position || !email || !contactNumber || !description) {
      Alert.alert('Warning', 'Please complete all fields before proceeding.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please provide a valid email address.');
      return;
    }

    if (!validateContactNumber(contactNumber)) {
      Alert.alert('Invalid Contact', 'Please provide a valid contact number.');
      return;
    }

    if (specializations.length === 0) {
      Alert.alert('Warning', 'Please select at least one specialization.');
      return;
    }

    try {
      const { data, error } = await supabase.from('hospitalregistration').insert([
        {
          registration_id: Math.random().toString(36).substring(2, 15),
          hospital_name: hospitalName,
          location,
          name,
          position,
          email,
          contact_number: contactNumber,
          description,
          specializations: specializations.join(', '),
          image_url: hospitalImage || '',
        },
      ]);

      if (error) throw error;

      Alert.alert('Success', 'Hospital registered successfully!', [
        {
          text: 'OK',
          onPress: () => {
            router.push('./');
            setHospitalName('');
            setLocation('');
            setName('');
            setPosition('');
            setEmail('');
            setContactNumber('');
            setDescription('');
            setSpecializations([]);
            setHospitalImage(null);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', `Failed to save data: ${error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Hospital Registration Form</Text>

      <TextInput
        style={[styles.input, styles.textArea]}
        label="Hospital Name"
        value={hospitalName}
        onChangeText={setHospitalName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        label="Location"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Specializations</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownText}>
          {specializations.length > 0
            ? specializations.join(', ')
            : 'Select Specializations'}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={24} color="#333" />
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Specializations</Text>
            <FlatList
              data={specializationOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.checkboxItem}
                  onPress={() => toggleSpecialization(item)}
                >
                  <MaterialCommunityIcons
                    name={
                      specializations.includes(item)
                        ? 'checkbox-marked'
                        : 'checkbox-blank-outline'
                    }
                    size={24}
                    color="#333"
                  />
                  <Text style={styles.checkboxText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TextInput
        style={[styles.input, styles.textArea]}
        label="Contact Person"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        label="Position"
        value={position}
        onChangeText={setPosition}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        label="Contact Number"
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        label="Description of Services"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {hospitalImage && (
        <Image source={{ uri: hospitalImage }} style={styles.image} />
      )}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>Upload Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#6A5ACD',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'white',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  textArea: {
    backgroundColor: '#6A5ACD',
    borderRadius: 10,
    color: 'white',
  },
  dropdownText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 50,
    padding: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxText: {
    marginLeft: 10,
  },
  modalButton: {
    backgroundColor: '#5A8EE0',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
  },
  uploadButton: {
    backgroundColor: '#5A8EE0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  uploadButtonText: {
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#6A5ACD',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadButtonText: {
    color: '#6A5ACD',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FormScreen;
