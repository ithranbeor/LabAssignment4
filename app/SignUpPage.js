import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert, Image, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Button, TextInput as PaperInput, DefaultTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const customTextColor = '#333333';
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: customTextColor,
    },
  };

  const router = useRouter();

  const generateRandomID = () => {
    const characters = '0123456789';
    let id = '';
    for (let i = 0; i < 10; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri); 
    }
  };

  const handleDateChange = (date) => {
    setBirthday(date.toISOString().split('T')[0]);
    setShowDatePicker(false); 
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleSignInRedirect = () => {
    router.push('/SignInPage'); 
  };

  const handleSignUp = async () => {
    if (!username || !email || !phone || !birthday || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }
  
    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
  
    if (!profilePicture) {
      Alert.alert('Error', 'Please upload a profile picture');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  
    const randomID = generateRandomID();
    const normalizedEmail = email.toLowerCase();
    const normalizedPassword = password.toLowerCase();
  
    const { user, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: normalizedPassword,
      options: {
        data: { display_name: username },
      },
    });
  
    if (authError) {
      Alert.alert('Error', authError.message);
      return;
    }
  
    const { error: dbError } = await supabase
      .from('accDetails')
      .insert([{
        id: randomID,
        username,
        email: normalizedEmail,
        phone,
        birthday,
        password: normalizedPassword,
        profile_Picture: profilePicture,
      }]);
  
    if (dbError) {
      Alert.alert('Error', dbError.message);
      return;
    }
  
    Alert.alert('Sign Up Successful', `Welcome, ${username}!`);
    router.push('/SignInPage');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#628ff3" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign Up</Text>

          {profilePicture && (
            <Image source={{ uri: profilePicture }} style={styles.profileImage} />
          )}

          <Button mode="contained" onPress={pickImage} style={styles.uploadButton}>
            Upload Profile Picture
          </Button>

          <PaperInput
            style={styles.input}
            label="Username"
            value={username}
            onChangeText={setUsername}
            theme={customTheme}
          />
          <PaperInput
            style={styles.input}
            label="Email"
            value={email}
            onChangeText={setEmail}
            theme={customTheme}
          />
          <PaperInput
            style={styles.input}
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            theme={customTheme}
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <PaperInput
              style={styles.input}
              label="Birthday"
              value={birthday}
              editable={false}
              theme={customTheme}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePickerModal
              isVisible={showDatePicker}
              mode="date"
              date={new Date(birthday || Date.now())}
              onConfirm={handleDateChange}
              onCancel={() => setShowDatePicker(false)}
            />
          )}

          <PaperInput
            style={styles.input}
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            theme={customTheme}
            right={(
              <PaperInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            )}
          />

          <PaperInput
            style={styles.input}
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            theme={customTheme}
            secureTextEntry={!showConfirmPassword}
            right={(
              <PaperInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            )}
          />

          <Button mode="contained" style={styles.button} onPress={handleSignUp}>
            Sign up
          </Button>

          <Text style={styles.signInText}>
            Already have an account?{' '}
            <Text style={styles.signInLink} onPress={handleSignInRedirect}>
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5A8EE0',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    marginTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#CBDCEB',
  },
  button: {
    backgroundColor: '#5A8EE0',
    borderRadius: 30,
    width: '100%',
    marginBottom: 20,
  },
  uploadButton: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  signInText: {
    fontSize: 16,
    color: '#000000',
  },
  signInLink: {
    color: '#5A8EE0',
    fontWeight: 'bold',
  },
});

export default SignUpPage;
