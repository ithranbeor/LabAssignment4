import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';

const ProfileScreen = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

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
              .select('username, profile_Picture')
              .eq('email', authData.user.email)
              .single(); 

            if (profileError || !profileData) {
              console.error('Profile Error:', profileError?.message || 'No profile data found');
              return;
            }

            const profilePic = profileData?.profile_Picture
              ? profileData.profile_Picture 
              : 'https://via.placeholder.com/100?text=No+Image'; 

            setUser({
              ...authData.user,
              username: profileData?.username,
              profile_Picture: profilePic,
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData(); 
    }, []);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }
  
    try {
      const { error: authError } = await supabase.auth.updateUser({
        password: newPassword,
      });
  
      if (authError) {
        Alert.alert('Error', authError.message);
        return;
      }
  
      const { error: dbError } = await supabase
        .from('accDetails')
        .update({ password: newPassword })  
        .eq('email', user.email);
  
      if (dbError) {
        Alert.alert('Error', dbError.message);
        return;
      }
  
      Alert.alert('Success', 'Your password has been changed successfully.');
      router.back();
    } catch (error) {
      console.log('Error changing password:', error);
      Alert.alert('Error', 'An error occurred while changing the password.');
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => router.push('../profile')}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
         <View style={styles.profileContainer}>
            <Image
              source={user?.profile_Picture ? { uri: user.profile_Picture } : require('../../../assets/images/defaultpp.png')}
              style={styles.profilePicture}
            />
          </View>
        <Text style={styles.name}>{user?.username || 'Loading'}</Text>
        <Text style={styles.email}>{user?.email || 'Loading'}</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleChangePassword}>
          <Text style={styles.submitButtonText}>Change Password</Text>
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
  profileContainer: {
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
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 130,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#dfe6ff',
    marginTop: 5,
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
});

export default ProfileScreen;
