import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useRouter } from 'expo-router';
const supabase = createClient(
  'https://vmaalvritikdvlyntzal.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtYWFsdnJpdGlrZHZseW50emFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzg5NDg1MCwiZXhwIjoyMDQ5NDcwODUwfQ.c0wN5Zh6Kes59pzAnT7QRa4mq5OgWiGH_Y-QNuRN8mg'
);

const ViewAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter(); 

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('accDetails')
        .select('id, username, email, phone, birthday, password');

      if (error) {
        console.error('Supabase Error:', error);
        Alert.alert('Error', 'Failed to fetch accounts. Please check the logs.');
        return;
      }

      setAccounts(data || []);
    } catch (err) {
      console.error('Unexpected Error:', err);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (id) => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('accDetails')
                .delete()
                .eq('id', id);

              if (error) {
                console.error('Supabase Error:', error);
                Alert.alert('Error', 'Failed to delete the account.');
                return;
              }

              setAccounts((prevAccounts) => prevAccounts.filter(account => account.id !== id));
              setSelectedAccount(null);
              Alert.alert('Success', 'Account deleted successfully.');
            } catch (err) {
              console.error('Unexpected Error:', err);
              Alert.alert('Error', 'An unexpected error occurred.');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSelectAccount = (account) => {
    if (selectedAccount && selectedAccount.id === account.id) {
      setSelectedAccount(null);
    } else {
      setSelectedAccount(account);
    }
  };

  const filteredAccounts = accounts.filter(account => 
    account.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    account.id.toString().includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6A5ACD" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.header}>Accounts</Text>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Name or ID"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {filteredAccounts.length === 0 ? (
            <Text style={styles.noDataText}>No accounts found.</Text>
          ) : (
            <FlatList
              data={filteredAccounts}
              keyExtractor={(item) => item.email}
              renderItem={({ item }) => (
                <View style={styles.accountItem}>
                  <TouchableOpacity onPress={() => handleSelectAccount(item)}>
                    <Text style={styles.accountName}>{item.username}</Text>
                  </TouchableOpacity>
                  {selectedAccount && selectedAccount.id === item.id && (
                    <View style={styles.details}>
                      <Text style={styles.accountText}>ID: {item.id}</Text>
                      <Text style={styles.accountText}>Username: {item.username}</Text>
                      <Text style={styles.accountText}>Email: {item.email}</Text>
                      <Text style={styles.accountText}>Phone: {item.phone}</Text>
                      <Text style={styles.accountText}>Birthday: {item.birthday}</Text>
                      <Text style={styles.accountText}>Password: {item.password}</Text>
                      <TouchableOpacity onPress={() => deleteAccount(item.id)} style={styles.deleteButton}>
                        <MaterialCommunityIcons name="delete" size={30} color="red" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#628ff3',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  accountItem: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  accountName: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  accountText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  details: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
  },
  noDataText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  deleteButton: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default ViewAccounts;
