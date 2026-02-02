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
} from "react-native";
import { supabase } from "../supabaseClient";

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // input full_name
  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert("Error Pendaftaran", error.message);
      return;
    }

    const userId = data.user?.id;
    if (!userId) return;

    // Masukkan ke users
    const { error: userError } = await supabase
      .from("users")
      .insert([{ id: userId, email, full_name: fullName, role: "jemaat" }]);
    if (userError) {
      Alert.alert("Error", userError.message);
      return;
    }

    // Masukkan ke profiles dengan default values
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: userId, gender: "male", parish: "Paroki Santa Clara" }]);
    if (profileError) {
      Alert.alert("Error", profileError.message);
      return;
    }

    Alert.alert("Pendaftaran Berhasil", "Akun berhasil dibuat. Silakan login.");
    navigation.replace("Login");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, padding: 16 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Buat Akun Baru</Text>

        <TextInput
          placeholder="Nama Lengkap"
          value={fullName}
          onChangeText={setFullName}
          style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
        />

        <TouchableOpacity
          onPress={handleSignup}
          style={{ backgroundColor: "#007bff", padding: 12, marginVertical: 8 }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Daftar Sekarang
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 24,
    color: "#4299E1",
    fontWeight: "bold",
    marginTop: -2,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
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
    marginBottom: 24,
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
  passwordHint: {
    fontSize: 12,
    color: "#A0AEC0",
    marginTop: 8,
    fontStyle: "italic",
  },
  signupButton: {
    backgroundColor: "#48BB78",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#718096",
    fontSize: 14,
  },
  loginLink: {
    color: "#4299E1",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footerText: {
    color: "#A0AEC0",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
