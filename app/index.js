import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const MAIN_COLOR = '#628ff3';

export default function Index() {
  const [activeButton, setActiveButton] = useState('SignIn');
  const router = useRouter(); 

  const handleSignInPress = () => {
    setActiveButton('SignIn');
    router.replace('/SignInPage'); 
  };

  const handleSignUpPress = () => {
    setActiveButton('SignUp');
    router.push('/SignUpPage'); 
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={MAIN_COLOR} />
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/MediSearchLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Taskly</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, activeButton === 'SignIn' && styles.activeButton]}
          onPress={handleSignInPress}
        >
          <Text style={[styles.buttonText, activeButton === 'SignIn' && styles.activeButtonText]}>
            Sign in
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, activeButton === 'SignUp' && styles.activeButton2]}
          onPress={handleSignUpPress}
        >
          <Text style={[styles.buttonText, activeButton === 'SignUp' && styles.activeButtonText]}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MAIN_COLOR,
  },
  logoContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: undefined,
    aspectRatio: 1,
  },
  title: {
    marginTop: -35,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: MAIN_COLOR,
  },
  activeButton: {
    backgroundColor: 'white',
    borderTopRightRadius: 20,
  },
  activeButton2: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  activeButtonText: {
    color: MAIN_COLOR,
  },
});
