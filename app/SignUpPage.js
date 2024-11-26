import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert } from 'react-native';
import { Button, TextInput as PaperInput, DefaultTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

const SignUpPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const customTextColor = '#333333'; 
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: customTextColor, 
    },
  };

  const router = useRouter();

  const handleSignUp = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    Alert.alert('Sign Up Successful', `Welcome, ${firstName}!`);
  };

  const handleSignInRedirect = () => {
    router.push('/SignInPage'); 
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#628ff3" />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign Up</Text>

        <PaperInput
          style={styles.input}
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          theme={customTheme}
        />
        <PaperInput
          style={styles.input}
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          theme={customTheme}
        />
        <PaperInput
          style={styles.input}
          label="Email/Username"
          value={email}
          onChangeText={setEmail}
          theme={customTheme}
        />
        <PaperInput
          style={styles.input}
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          theme={customTheme}
          right={
            <PaperInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        <PaperInput
          style={styles.input}
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          theme={customTheme}
          secureTextEntry={!showConfirmPassword}
          right={
            <PaperInput.Icon
              icon={showConfirmPassword ? 'eye-off' : 'eye'} 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
        />

        <Button mode="contained" style={styles.button} onPress={handleSignUp}>
          Sign up
          
        </Button>

        <Text style={styles.signInText}>
          Already have an account?{' '}
          <Text style={styles.signInLink} onPress={handleSignInRedirect}>Sign In</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5A8EE0',
    justifyContent: 'flex-start',
  },
  formContainer: {
    flex: 1,
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
