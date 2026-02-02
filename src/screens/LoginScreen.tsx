import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../supabaseClient";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login Error", error.message);
      return;
    }

    // Ambil role user dari tabel "users"
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user?.id)
      .single();

    if (roleError) {
      Alert.alert("Error", roleError.message);
      return;
    }

    // Reset stack → Dashboard jadi root, back button hilang
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "Dashboard",
          params: { role: userData?.role || "jemaat" },
        },
      ],
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Selamat Datang</Text>
          <Text style={styles.subtitle}>Aplikasi Paroki Santa Clara</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="masukkan email anda"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="masukkan password anda"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Masuk</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate("Signup")}
            activeOpacity={0.8}
          >
            <Text style={styles.signupButtonText}>Buat Akun Baru</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F7FAFC",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#2D3748",
  },
  loginButton: {
    backgroundColor: "#4299E1",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    color: "#718096",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  signupButton: {
    borderWidth: 1.5,
    borderColor: "#4299E1",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#4299E1",
    fontSize: 16,
    fontWeight: "600",
  },
});
