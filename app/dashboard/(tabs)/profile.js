import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';

const ProfilePage = () => {
  const router = useRouter();
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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/'); 
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return <Text>Loading...</Text>; 
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <Image
            source={user?.profile_Picture ? { uri: user.profile_Picture } : require('../../../assets/images/defaultpp.png')}
            style={styles.profilePicture}
          />
        </View>

        <Text style={styles.name}>{user?.username || 'No Username'}</Text>
        <Text style={styles.email}>{user?.email || 'No Email'}</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => router.push('../editProfile')}
        >
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => router.push('../changePass')}
        >
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
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
  optionsContainer: {
    backgroundColor: '#d9e4ff',
    width: '90%',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: '#628bf8',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  signOutButton: {
    margin: 20,
  },
  signOutText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ProfilePage;
