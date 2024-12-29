import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, Alert, Platform } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { useRouter } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../lib/supabase';
import * as Location from 'expo-location'; 
import MapViewDirections from 'react-native-maps-directions';

export default function HomeScreen() {
  const router = useRouter();
  const mapRef = useRef(null);
  const navigation = useNavigation();

  const [region, setRegion] = useState({
    latitude: 8.482,
    longitude: 124.646,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markerPosition, setMarkerPosition] = useState({
    latitude: 8.482,
    longitude: 124.646,
  });

  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [destination, setDestination] = useState({
    latitude: 8.481, 
    longitude: 124.647, 
  });

  useEffect(() => {
    requestPermissions();
    fetchUsername();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
      }
    }
  };

  const handleNavigate = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need location permission to proceed.");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    setRegion((prevRegion) => ({
      ...prevRegion,
      latitude,
      longitude,
    }));

    setMarkerPosition({
      latitude,
      longitude,
    });

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
    }
  };

  const fetchUsername = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.log("Error fetching user:", authError.message);
        return;
      }

      if (user?.email) {
        const { data, error } = await supabase
          .from("accDetails")
          .select("username, profile_Picture, email")
          .eq("email", user.email);

        if (error) {
          console.log("Error fetching user details:", error.message);
          return;
        }

        if (data && data.length > 0) {
          setUsername(data[0].username);
          setProfilePicture(data[0].profile_Picture);
        } else {
          console.log("No matching email found in accDetails for:", user.email);
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
  
    if (query.length > 0) {
      const { data: diseaseData, error: diseaseError } = await supabase
        .from("add_disease")
        .select("disease_id, diseaseName, diseaseDescription, symptoms")
        .ilike("diseaseName", `${query}%`);
  
      const { data: symptomsData, error: symptomsError } = await supabase
        .from("add_symptoms")
        .select("symptoms_id, symptomsName, symptomsDescription")
        .ilike("symptomsName", `${query}%`);
  
      const { data: hospitalData, error: hospitalError } = await supabase
        .from("hospitalregistration")
        .select("hospital_name, location, specializations, registration_id")
        .ilike("hospital_name", `${query}%`)
        .ilike("specializations", `%${query}%`);
  
      if (diseaseError || symptomsError || hospitalError) {
        console.error("Error searching:", diseaseError || symptomsError || hospitalError);
        return;
      }
  
      const combinedResults = [
        ...diseaseData.map(disease => ({ type: 'Disease', ...disease })),
        ...symptomsData.map(symptom => ({ type: 'Symptom', ...symptom })),
        ...hospitalData.map(hospital => ({
          type: 'Hospital',
          hospital_name: hospital.hospital_name,
          location: hospital.location,
          specializations: hospital.specializations,
          registration_id: hospital.registration_id,
        })),
      ];
  
      setSearchResults(combinedResults);
    } else {
      setSearchResults([]);  
    }
  };  

  const renderSearchResults = ({ item }) => {
    const handleResultClick = () => {
      if (item.type === 'Hospital') {
        router.push({
          pathname: '/HospitalProfile',
          query: { hospitalId: item.registration_id },
        });cd  
      } else if (item.type === 'Disease' || item.type === 'Symptom') {
        router.push({
          pathname: '/symptoms',
          query: { query: item.diseaseName || item.symptomsName },
        });
      }
    };

    return (
      <TouchableOpacity style={styles.resultItem} onPress={handleResultClick}>
        <Text style={styles.resultText}>
          {item.type === 'Disease' && `${item.diseaseName} - ${item.diseaseDescription}`}
          {item.type === 'Symptom' && `${item.symptomsName} - ${item.symptomsDescription}`}
          {item.type === 'Hospital' && `${item.hospital_name} - Specialization: ${item.specializations}`}
          {item.type === 'Hospital' && `Location: ${item.location}`}
        </Text>
      </TouchableOpacity>
    );
  };

  const goToCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setMarkerPosition({
        latitude,
        longitude,
      });
    } catch (error) {
      Alert.alert("Error", "Unable to get current location");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons name="menu" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.greeting}>Hi {username || "User"},</Text>
        <Text style={styles.subtitle}>What symptoms or disease are you looking for?</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for Symptoms, Disease"
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          
          {searchQuery.length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => `${item.type}-${index}`}
              renderItem={renderSearchResults}
              style={styles.searchResults}
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.profilePictureContainer}
          onPress={() => router.push("./profile")}
        >
          <Image
            source={profilePicture ? { uri: profilePicture } : require('../../../assets/images/defaultpp.png')}
            style={styles.profilePicture}
          />
        </TouchableOpacity>
      </View>

      {/* Map with Directions */}
      <View style={styles.mapArea}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          region={region}
          showsUserLocation={true}
          loadingEnabled={true}
          onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        >
          <Marker
            coordinate={markerPosition}
            title="My Location"
            description="This is your current location."
          />
          
          <MapViewDirections
            origin={markerPosition}
            destination={destination}
            apikey={"AIzaSyAhEGnDTpMbbMmK9PIV2J-X9kYF-OifBCg"}
            strokeWidth={3}
            strokeColor="hotpink"
          />
        </MapView>
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.symptomsButton} onPress={() => router.push('../../HospitalList')}>
          <View style={styles.symptomsButtonBackground}>
            <MaterialCommunityIcons name="hospital-building" size={30} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleNavigate}>
          <View style={styles.navButtonBackground}>
            <MaterialCommunityIcons name="navigation" size={80} color="red" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.symptomsButton} onPress={() => router.push("../../symptoms")}>
          <View style={styles.symptomsButtonBackground}>
            <MaterialCommunityIcons name="emoticon-sick-outline" size={30} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0E8FF",
  },
  header: {
    backgroundColor: "#5A8EE0",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
    zIndex: 1,
    position: "absolute",
    width: "100%",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginVertical: 10,
  },
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 10,
    paddingLeft: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchResults: {
    maxHeight: 200,
    marginTop: 10,
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  resultText: {
    fontSize: 16,
  },
  profilePictureContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  mapArea: {
    flex: 1,
    marginTop: 120,
    marginHorizontal: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingVertical: 20,
    backgroundColor: "transparent",
  },
  navButton: {
    marginHorizontal: 20,
    justifyContent: "center",
  },
  navButtonBackground: {
    width: 80,
    height: 80,
    backgroundColor: "transparent",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  symptomsButton: {
    marginHorizontal: 20,
  },
  symptomsButtonBackground: {
    width: 60,
    height: 60,
    backgroundColor: "#5A8EE0",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
