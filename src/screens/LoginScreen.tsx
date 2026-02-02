import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../supabaseClient";

const { width } = Dimensions.get("window");

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Color palette based on #A85603 (warm orange/brown)
  const primaryColor = "#A85603";
  const primaryLight = "#FF8C42";
  const backgroundColor = "#FFF9F0";
  const cardBackground = "#FFFFFF";
  const textPrimary = "#2C3E50";
  const textSecondary = "#7F8C8D";
  const borderColor = "#E2E8F0";

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Validasi", "Email wajib diisi");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Validasi", "Password wajib diisi");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login Gagal", error.message);
      setLoading(false);
      return;
    }

    // Get user role from "users" table
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role, full_name")
      .eq("id", data.user?.id)
      .single();

    if (roleError) {
      Alert.alert("Error", roleError.message);
      setLoading(false);
      return;
    }

    // Reset stack → Dashboard sebagai root
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "Dashboard",
          params: {
            role: userData?.role || "jemaat",
            fullName: userData?.full_name || "",
          },
        },
      ],
    });
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />

      {/* Background decorative elements */}
      <View style={styles.backgroundDecor}>
        <View
          style={[
            styles.decorCircle,
            { backgroundColor: `${primaryColor}20`, top: -50, right: -50 },
          ]}
        />
        <View
          style={[
            styles.decorCircle,
            { backgroundColor: `${primaryLight}20`, bottom: 100, left: -50 },
          ]}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section dengan Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              {/* GANTI INI DENGAN LOGO */}
              <View style={styles.logoWrapper}>
                <Image
                  source={require("../../assets/images/Logo-Santa-Clara-Bekasi-Transparant-SMALL.png")} // Sesuaikan path
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text style={styles.title}>Selamat Datang</Text>
            <Text style={styles.subtitle}>Paroki Santa Clara Bekasi</Text>
            <Text style={styles.description}>
              Masuk untuk mengakses jadwal misa, pengumuman, dan kegiatan paroki
            </Text>
          </View>

          {/* Login Form */}
          <View
            style={[styles.formContainer, { backgroundColor: cardBackground }]}
          >
            <Text style={styles.formTitle}>Masuk ke Akun Anda</Text>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="contoh: nama@email.com"
                placeholderTextColor={textSecondary}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="Masukkan password Anda"
                placeholderTextColor={textSecondary}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                autoComplete="password"
              />
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: primaryColor }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>
                {loading ? "🔄 Memproses..." : "🔑 Masuk ke Akun"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            {/* <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>atau masuk dengan</Text>
              <View style={styles.dividerLine} />
            </View> */}

            {/* Social Login (Optional) */}
            {/* <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>📱</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>🔵</Text>
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            </View> */}
          </View>

          {/* Register Section */}
          <View
            style={[
              styles.registerSection,
              { backgroundColor: cardBackground },
            ]}
          >
            <Text style={styles.registerTitle}>Belum punya akun?</Text>
            <Text style={styles.registerDesc}>
              Bergabunglah dengan komunitas Paroki Santa Clara untuk mendapatkan
              akses penuh
            </Text>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate("Signup")}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>📝 Daftar Sekarang</Text>
            </TouchableOpacity>
          </View>

          {/* Features Preview */}
          {/* <View style={styles.featuresPreview}>
            <Text style={styles.featuresTitle}>Apa yang bisa Anda akses?</Text>
            <View style={styles.featuresList}>
              {[
                { icon: "✝️", text: "Jadwal Misa Lengkap" },
                { icon: "📢", text: "Pengumuman Terkini" },
                { icon: "📅", text: "Kalender Kegiatan" },
                { icon: "📖", text: "Renungan Harian" },
                { icon: "❤️", text: "Donasi Online" },
                { icon: "🖼️", text: "Galeri Paroki" },
              ].map((item, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>{item.icon}</Text>
                  <Text style={styles.featureText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View> */}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Paroki Santa Clara Bekasi</Text>
            <Text style={styles.footerSubText}>
              Membangun Iman, Menguatkan Persaudaraan
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundDecor: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  decorCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.2,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    zIndex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // Transparan untuk logo PNG
  },
  logoImage: {
    width: "100%",
    height: "100%",
    // Tambahkan shadow jika logo terlalu terang
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: "#A85603",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formContainer: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 24,
    textAlign: "center",
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
    color: "#2C3E50",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
    color: "#A85603",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
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
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  socialIcon: {
    fontSize: 20,
  },
  socialText: {
    fontSize: 14,
    color: "#4A5568",
    fontWeight: "500",
  },
  registerSection: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  registerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 8,
    textAlign: "center",
  },
  registerDesc: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  registerButton: {
    borderWidth: 1.5,
    borderColor: "#A85603",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  registerButtonText: {
    color: "#A85603",
    fontSize: 15,
    fontWeight: "600",
  },
  featuresPreview: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 20,
    textAlign: "center",
  },
  featuresList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureItem: {
    width: (width - 60) / 2,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: "#4A5568",
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  footerSubText: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
  },
});
