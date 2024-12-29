import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HospitalProfile = () => {
  const [hospital, setHospital] = useState(null);
  const [error, setError] = useState(null);
  const { hospitalId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      const { data, error } = await supabase
        .from('hospitalregistration')
        .select('*')
        .eq('registration_id', hospitalId)
        .single();

      if (error) {
        console.error('Error fetching hospital details:', error.message);
        setError('Failed to load hospital details.');
      } else {
        setHospital(data);
      }
    };

    if (hospitalId) {
      fetchHospitalDetails();
    }
  }, [hospitalId]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!hospital) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
      <TouchableOpacity
            style={styles.backIcon}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

      <Text style={styles.hospitalProfileName}>Hospital Profile</Text>

      {hospital.image_url ? (
        <Image source={{ uri: hospital.image_url }} style={styles.hospitalImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>No Image</Text>
        </View>
      )}


      </View>

      <View style={styles.hospitalName}>
        <Text style={styles.hospitalName}>{hospital.hospital_name}</Text>
        <Text style={styles.hospitalLocation}>{hospital.location}</Text>
      </View>

      <View style={styles.card}>
        <InfoRow label="Phone" value={hospital.contact_number || 'N/A'} isLink={!!hospital.contact_number} linkType="phone" />
        <InfoRow label="Hours" value={hospital.operating_hours || 'Open 24 hours'} status="green" />
        <InfoRow label="Email" value={hospital.email || 'N/A'} isLink={!!hospital.email} linkType="email" />
      </View>

      <View style={styles.card}>
        <Text style={styles.infoLabel}>Description:</Text>
        <Text style={styles.infoValue}>
          {hospital.description || 'No description available for this hospital.'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.infoLabel}>Specializations:</Text>
        <View style={styles.servicesList}>
          {(hospital.specializations || [])
            .split(',')
            .map((specialization, index) => (
              <Text key={index} style={styles.serviceItem}>
                {specialization.trim()}
              </Text>
            ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.infoLabel}>Contact Name:</Text>
        <Text style={styles.infoValue}>{hospital.name || 'N/A'}</Text>
        <Text style={styles.infoLabel}>Position:</Text>
        <Text style={styles.infoValue}>{hospital.position || 'N/A'}</Text>
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value, status, isLink, linkType }) => {
  const statusColor = status === 'green' ? { color: 'green' } : { color: '#555' };

  const handleLinkPress = () => {
    if (isLink) {
      const link = linkType === 'phone' ? `tel:${value}` : `mailto:${value}`;
      Linking.openURL(link).catch((err) => console.error('Failed to open link:', err));
    }
  };

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <TouchableOpacity onPress={isLink ? handleLinkPress : null} disabled={!isLink}>
        <Text style={[styles.infoValue, statusColor]}>{value}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 0,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerContainer: {
    backgroundColor: '#628bf8',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 0,
    position: 'relative',
  },
  hospitalImage: {
    width: '90%',
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePlaceholder: {
    width: '100%',
    height: 220,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 20,
  },
  imageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  hospitalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    margin: 8,
  },
  hospitalProfileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  hospitalLocation: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#628ff3',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.100,
    shadowRadius: 4,
    elevation: 10,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 15,
    color: '#555',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  servicesList: {
    marginLeft: 20,
    marginTop: 5,
  },
  serviceItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});

export default HospitalProfile;
