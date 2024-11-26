import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, StatusBar, Animated, Image } from 'react-native';
import { TextInput as PaperInput, Button, DefaultTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; 

const SignInPage = () => {
  const [username, setUsername] = useState('');
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
        const savedUsername = await AsyncStorage.getItem('username');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedUsername && savedPassword) {
          setUsername(savedUsername);
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
    if (username === 'Admin' && password === 'Admin') {
      if (rememberMe) {
        try {
          await AsyncStorage.setItem('username', username);
          await AsyncStorage.setItem('password', password);
        } catch (error) {
          console.log('Error saving credentials', error);
        }
      } else {
        try {
          await AsyncStorage.removeItem('username');
          await AsyncStorage.removeItem('password');
        } catch (error) {
          console.log('Error clearing credentials', error);
        }
      }
      router.replace('/dashboard'); 
    } else if (username === '' || password === '') {
      Alert.alert('Error', 'Please enter your username and password');
    } else {
      Alert.alert('Error', 'Invalid username or password');
    }
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleSignUpRedirect = () => {
    router.push('/SignUpPage');
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
          label="Username"
          value={username}
          onChangeText={setUsername}
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
          <Text style={styles.signUpLink} onPress={handleAccountRecoveryRedirect}>Forgot password?</Text>
          </Button>
        </View>

        <Button mode="contained" style={styles.button} onPress={handleSignIn}>
          Sign in
        </Button>

        <Text style={styles.signUpText}>
          Don't have an account?{' '}
          <Text style={styles.signUpLink} onPress={handleSignUpRedirect}>Sign up</Text>
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
