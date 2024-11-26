import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const App = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../../assets/images/ithran.jpg')}
            style={styles.profileImage}
          />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>4.9</Text>
          </View>
        </View>
        <Text style={styles.name}>Ithran Beor Turno</Text>
        <Text style={styles.location}>Philippines, 21 y.o</Text>
      </View>

      {/* Statistics Section */}
      <View style={styles.statisticsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>13 500</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>14 700</Text>
          <Text style={styles.statLabel}>Visits</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>812</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Experience</Text>
          <Text style={styles.detailValue}>6 years</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Specialization</Text>
          <Text style={styles.detailValue}>
            Digital Marketing, Marketing, Data Analytics, Social Media
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>About</Text>
          <Text style={styles.detailValue}>
          This is my project in Mobile Programming. I am Ithran Beor Turno and I am 21 years old from Barangay Puntod, Cagayan de Oro City.
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Hobbies</Text>
          <Text style={styles.detailValue}>Singing</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    width: '112%',
    marginBottom: 5,
    position: 'relative',
    backgroundColor: '#003366',
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  settingsIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: '#fbc02d',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ratingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  location: {
    fontSize: 14,
    color: '#dcdcdc',
  },
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
    paddingHorizontal: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailsContainer: {
    backgroundColor: '#003366',
    width: '112%',
    padding: 20,
    borderRadius: 20,
  },
  detailItem: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    color: '#fff',
  },
});

export default App;
