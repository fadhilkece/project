import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; // Pastikan expo/vector-icons terinstal

const Stack = createNativeStackNavigator();

// --- 1. SCREEN: SPLASH ---
function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 2500);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Ionicons name="leaf" size={100} color="#4CAF50" />
      <Text style={styles.splashTitle}>Smart Goat</Text>
      <Text style={styles.splashSubtitle}>IoT Livestock Monitoring</Text>
    </View>
  );
}

// --- 2. SCREEN: LOGIN ---
function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      navigation.replace('Dashboard');
    } else {
      Alert.alert('Error', 'Username atau password salah! (Gunakan admin/admin)');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Selamat Datang</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="Username" 
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
        <Text style={styles.buttonText}>Masuk</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- 3. SCREEN: DASHBOARD ---
function DashboardScreen({ navigation }) {
  const [goats, setGoats] = useState([
    { id: '1', tag: 'Kambing A-01', weight: 45, status: 'Sehat', lastFeed: '08:00 AM' },
    { id: '2', tag: 'Kambing B-02', weight: 38, status: 'Perlu Cek', lastFeed: '08:15 AM' },
    { id: '3', tag: 'Kambing C-03', weight: 50, status: 'Siap Panen', lastFeed: '07:45 AM' },
  ]);

  const renderGoat = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('Detail', { goat: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.tag}</Text>
        <Text style={[styles.statusBadge, item.status === 'Sehat' ? styles.bgGreen : item.status === 'Siap Panen' ? styles.bgBlue : styles.bgRed]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.cardDesc}>Berat: {item.weight} kg</Text>
      <Text style={styles.cardDesc}>Makan Terakhir: {item.lastFeed}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dashboardHeader}>
        <Text style={styles.headerText}>Monitoring Kandang</Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      
      <FlatList 
        data={goats}
        keyExtractor={item => item.id}
        renderItem={renderGoat}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

// --- 4. SCREEN: GOAT DETAIL & IoT CONTROL ---
function GoatDetailScreen({ route }) {
  const { goat } = route.params;
  const [motorStatus, setMotorStatus] = useState(false);

  const toggleFeeder = () => {
    setMotorStatus(!motorStatus);
    Alert.alert('IoT Command', `Motor pakan ${!motorStatus ? 'Dinyalakan' : 'Dimatikan'} untuk ${goat.tag}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailBox}>
        <Ionicons name="analytics-outline" size={50} color="#4CAF50" />
        <Text style={styles.detailTitle}>{goat.tag}</Text>
        <Text style={styles.detailText}>Berat Terkini: {goat.weight} kg</Text>
        <Text style={styles.detailText}>Status Kesehatan: {goat.status}</Text>
      </View>

      <Text style={styles.sectionTitle}>Kontrol IoT Pakan</Text>
      <View style={styles.controlBox}>
        <Text style={styles.controlText}>Status Motor Pakan: {motorStatus ? 'ON' : 'OFF'}</Text>
        <TouchableOpacity 
          style={[styles.buttonPrimary, motorStatus ? styles.bgRed : styles.bgGreen]} 
          onPress={toggleFeeder}
        >
          <Text style={styles.buttonText}>{motorStatus ? 'Matikan Pakan' : 'Beri Pakan Sekarang'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Data Sensor Lingkungan</Text>
      <View style={styles.sensorGrid}>
        <View style={styles.sensorCard}>
          <Ionicons name="thermometer-outline" size={30} color="#FF9800" />
          <Text>Suhu: 28°C</Text>
        </View>
        <View style={styles.sensorCard}>
          <Ionicons name="water-outline" size={30} color="#03A9F4" />
          <Text>Kelembaban: 65%</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// --- APP NAVIGATOR ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={GoatDetailScreen} options={{ title: 'Detail Ternak' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 20 },
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F5E9' },
  splashTitle: { fontSize: 32, fontWeight: 'bold', color: '#2E7D32', marginTop: 10 },
  splashSubtitle: { fontSize: 16, color: '#4CAF50' },
  headerText: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  dashboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  
  // Inputs
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 10, marginBottom: 15, borderWidth: 1, borderColor: '#DDD' },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16 },
  
  // Buttons
  buttonPrimary: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  
  // Cards
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardDesc: { fontSize: 14, color: '#666', marginBottom: 5 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, color: '#FFF', fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  
  // Details & Sensors
  detailBox: { alignItems: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 15, marginBottom: 20 },
  detailTitle: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  detailText: { fontSize: 16, color: '#555', marginBottom: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  controlBox: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, marginBottom: 20 },
  controlText: { fontSize: 16, marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
  sensorGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  sensorCard: { flex: 0.48, backgroundColor: '#FFF', padding: 20, borderRadius: 15, alignItems: 'center' },
  
  // Colors
  bgGreen: { backgroundColor: '#4CAF50' },
  bgRed: { backgroundColor: '#F44336' },
  bgBlue: { backgroundColor: '#2196F3' }
});