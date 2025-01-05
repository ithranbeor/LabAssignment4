import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, StatusBar, Animated, Image } from 'react-native';
import { TextInput as PaperInput, Button, DefaultTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase'; 

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const customTextColor = '#333333';
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: customTextColor,
    },
  };

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('email');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.log('Error loading credentials', error);
      }
    };
    loadCredentials();
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        console.log('Error:', error.message);
        Alert.alert('Error', 'Invalid email or password');
        return;
      }
  
      if (data) {
        if (rememberMe) {
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('password', password);
        } else {
          await AsyncStorage.removeItem('email');
          await AsyncStorage.removeItem('password');
        }
  
        Alert.alert('Success', 'You have signed in successfully');
        router.replace('/dashboard');
      }
  
    } catch (error) {
      console.error('Sign-in failed', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };
  
  

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const xample = () => {
    router.push('/dashboard');
  };

  const handleSignUpRedirect = () => {
    router.push('/SignUpPage');
  };

  const adminRedirect = () => {
    router.push('/admin');
  };
  
  const handleAccountRecoveryRedirect = () => {
    router.push('/AccRecoveryPage');
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: scrollY }] }]}>
      <StatusBar barStyle="light-content" backgroundColor="#628ff3" />
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/MediSearchLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <PaperInput
          style={styles.input}
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          theme={customTheme}
        />
        <PaperInput
          style={styles.input}
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          right={
            <PaperInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          mode="outlined"
          theme={customTheme}
        />

        <View style={styles.rememberForgotContainer}>
          <Button
            onPress={toggleRememberMe}
            mode="text"
            textColor="#5A8EE0"
            labelStyle={styles.rememberText}
          >
            {rememberMe ? '✓ Remember Me' : 'Remember Me'}
          </Button>
          <Button mode="text" textColor="#5A8EE0">
            <Text style={styles.signUpLink} onPress={handleAccountRecoveryRedirect}>
              Forgot password?
            </Text>
          </Button>
        </View>

        <Button mode="contained" style={styles.button} onPress={handleSignIn}>
          Sign in
        </Button>

        <Text style={styles.signUpText}>
          Don't have an account?{' '}
          <Text style={styles.signUpLink} onPress={handleSignUpRedirect}>
            Sign up
          </Text>
        </Text>
        <Text style={styles.signUpText}>
          Admin?{' '}
          <Text style={styles.signUpLink} onPress={adminRedirect}>
            Sign in
          </Text>
        </Text>
      </View>
    </Animated.View>
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
    marginTop: 1,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  rememberForgotContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  rememberText: {
    color: '#5A8EE0',
  },
  button: {
    backgroundColor: '#5A8EE0',
    borderRadius: 30,
    width: '100%',
    marginBottom: 20,
  },
  signUpText: {
    fontSize: 16,
    color: '#000000',
  },
  signUpLink: {
    color: '#5A8EE0',
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SignInPage;
