import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert } from 'react-native';
import { Button, TextInput as PaperInput, DefaultTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

const AccountRecoveryPage = () => {
  const [email, setEmail] = useState('');

  const router = useRouter();
  const handleSignInRedirect = () => {
    router.push('/SignInPage'); 
  };

  const customTextColor = '#333333'; 
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: customTextColor, 
    },
  };

  const handleRecovery = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    Alert.alert('Recovery Instructions Sent', `Check your email at ${email} for recovery instructions.`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#628ff3" />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Account Recovery</Text>
        <Text style={styles.EnterTheEmail}>Enter the email address associated 
          with your account and we'll send you a link to reset your password.</Text>

        <PaperInput
          style={styles.input}
          label="Email/Username"
          value={email}
          onChangeText={setEmail}
          theme={customTheme} 
        />

        <Button mode="contained" style={styles.button} onPress={handleRecovery}>
          Send Recovery Email
        </Button>

        <Text style={styles.signInText}>
          Remembered your password? <Text style={styles.signInLink} onPress={handleSignInRedirect}>Sign In</Text>
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
  EnterTheEmail: {
    fontSize: 14,
    color: '#5A8EE0',
    fontWeight: 'bold',

  },
  signInLink: {
    color: '#5A8EE0',
    fontWeight: 'bold',
  },
});

export default AccountRecoveryPage;
