import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [profilePicture, setProfilePicture] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const hasChanges =
    username !== user?.username ||
    phone !== user?.phone ||
    profilePicture !== user?.profile_Picture ||
    birthday.toISOString().split('T')[0] !== new Date(user?.birthday).toISOString().split('T')[0];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError) {
          console.error('Auth Error:', authError.message);
          return;
        }

        if (authData?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('accDetails')
            .select('id, username, profile_Picture, email, phone, birthday')
            .eq('email', authData.user.email)
            .single();

          if (profileError) {
            console.error('Profile Error:', profileError.message);
            return;
          }

          setUser(profileData);
          setUsername(profileData.username);
          setEmail(profileData.email);
          setPhone(profileData.phone);
          setBirthday(new Date(profileData.birthday));
          setProfilePicture(profileData.profile_Picture);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!username || !phone || !birthday) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const updates = {
      username,
      phone,
      birthday: birthday.toISOString().split('T')[0],
    };

    if (profilePicture) {
      updates.profile_Picture = profilePicture;
    }

    const { data, error } = await supabase
      .from('accDetails')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Success', 'Profile updated successfully.');
    router.push('../profile');
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    } else {
      Alert.alert('Error', 'An error occurred while picking the image.');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios' ? true : false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => router.push('../profile')}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profilePictureContainer}>
          <Image
            source={{ uri: profilePicture || 'https://via.placeholder.com/100?text=No+Image' }}
            style={styles.profileImage}
          />
          {profilePicture ? (
            <TouchableOpacity
              style={[styles.icon, styles.iconBottomLeft]}
              onPress={async () => {
                const { error } = await supabase
                  .from('accDetails')
                  .update({ profile_Picture: null })
                  .eq('id', user.id);

                if (error) {
                  Alert.alert('Error', 'An error occurred while deleting the image.');
                  console.error(error.message);
                } else {
                  setProfilePicture(null);
                  Alert.alert('Success', 'Profile picture deleted.');
                }
              }}
            >
              <MaterialCommunityIcons name="delete-circle-outline" size={30} color="maroon" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.icon, styles.iconBottomRight]}
              onPress={handlePickImage}
            >
              <MaterialCommunityIcons name="pencil-circle-outline" size={30} color="#555" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.name}>{user?.username || 'No Username'}</Text>
        <Text style={styles.email}>{user?.email || 'No Email'}</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          editable={false}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Birthday</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            placeholder="Select your birthday"
            value={birthday.toLocaleDateString()}
            editable={false}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthday}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <TouchableOpacity
          style={[styles.submitButton, { opacity: hasChanges ? 1 : 0.5 }]}
          onPress={handleUpdateProfile}
          disabled={!hasChanges}
        >
          <Text style={styles.submitButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 10,
    width: 150,
    height: 150,
    borderRadius: 60,
    borderWidth: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 130,
  },
  icon: {
    position: 'absolute',
  },
  iconBottomLeft: {
    bottom: 0,
    left: 10,
  },
  iconBottomRight: {
    bottom: 0,
    right: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 13,
    color: '#fff',
  },
  formContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#628bf8',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
});

export default EditProfileScreen;
