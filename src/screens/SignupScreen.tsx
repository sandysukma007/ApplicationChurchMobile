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

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  // Color palette based on #A85603 (warm orange/brown)
  const primaryColor = "#A85603";
  const primaryLight = "#FF8C42";
  const backgroundColor = "#FFF9F0";
  const cardBackground = "#FFFFFF";
  const textPrimary = "#2C3E50";
  const textSecondary = "#7F8C8D";
  const successColor = "#27AE60";
  const borderColor = "#E2E8F0";

  const handleSignup = async () => {
    if (!fullName.trim()) {
      Alert.alert("Validasi", "Nama lengkap wajib diisi");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Validasi", "Email wajib diisi");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validasi", "Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Error Pendaftaran", error.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    // Insert to users table
    const { error: userError } = await supabase.from("users").insert([
      {
        id: userId,
        email,
        full_name: fullName.trim(),
        role: "jemaat",
      },
    ]);

    if (userError) {
      Alert.alert("Error", userError.message);
      setLoading(false);
      return;
    }

    // Insert to profiles table with default values
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: userId,
        gender: "male",
        parish: "Paroki Santa Clara",
      },
    ]);

    if (profileError) {
      Alert.alert("Error", profileError.message);
      setLoading(false);
      return;
    }

    Alert.alert(
      "Pendaftaran Berhasil!",
      "Akun Anda telah berhasil dibuat. Silakan login dengan email dan password Anda.",
      [{ text: "OK", onPress: () => navigation.replace("Login") }],
    );
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
            { backgroundColor: `${primaryColor}20`, top: -50, left: -50 },
          ]}
        />
        <View
          style={[
            styles.decorCircle,
            { backgroundColor: `${primaryLight}20`, bottom: -50, right: -50 },
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
          {/* Back Button */}
          {/* <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity> */}

          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require("../../assets/images/Logo-Santa-Clara-Bekasi-Transparant-SMALL.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text style={styles.title}>Bergabung dengan</Text>
            <Text style={styles.subtitle}>Paroki Santa Clara</Text>
            <Text style={styles.description}>
              Lengkapi data berikut untuk menjadi bagian dari komunitas kami
            </Text>
          </View>

          {/* Form Section */}
          <View
            style={[styles.formContainer, { backgroundColor: cardBackground }]}
          >
            <Text style={styles.formTitle}>Data Pendaftaran</Text>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <TextInput
                placeholder="Masukkan nama lengkap Anda"
                placeholderTextColor={textSecondary}
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="contoh: nama@email.com"
                placeholderTextColor={textSecondary}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="Minimal 6 karakter"
                placeholderTextColor={textSecondary}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
              />
              <Text style={styles.passwordHint}>
                Gunakan kombinasi huruf dan angka untuk keamanan lebih baik
              </Text>
            </View>

            {/* Terms Agreement */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                Dengan mendaftar, Anda menyetujui{" "}
                <Text style={styles.termsLink}>Ketentuan Layanan</Text> dan{" "}
                <Text style={styles.termsLink}>Kebijakan Privasi</Text> kami
              </Text>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, { backgroundColor: successColor }]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>
                {loading ? "🔄 Membuat Akun..." : "📝 Daftar Sekarang"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Sudah punya akun?</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.loginLinkButton}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLinkText}>Masuk ke Akun Saya</Text>
            </TouchableOpacity>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Keuntungan Bergabung</Text>
            <View style={styles.featuresGrid}>
              {[
                {
                  icon: "📅",
                  title: "Jadwal Misa",
                  desc: "Akses jadwal lengkap",
                },
                {
                  icon: "📢",
                  title: "Pengumuman",
                  desc: "Info terbaru paroki",
                },
                { icon: "❤️", title: "Donasi Online", desc: "Dukungan mudah" },
                {
                  icon: "👥",
                  title: "Komunitas",
                  desc: "Terhubung dengan umat",
                },
              ].map((feature, index) => (
                <View key={index} style={styles.featureCard}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.desc}</Text>
                </View>
              ))}
            </View>
          </View>

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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 24,
    color: "#A85603",
    fontWeight: "bold",
    marginTop: -2,
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
    backgroundColor: "transparent",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#A85603",
    textAlign: "center",
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
    marginBottom: 32,
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
  passwordHint: {
    fontSize: 12,
    color: "#A0AEC0",
    marginTop: 8,
    fontStyle: "italic",
  },
  termsContainer: {
    backgroundColor: "#EDF2F7",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  termsText: {
    fontSize: 13,
    color: "#718096",
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: "#A85603",
    fontWeight: "600",
  },
  registerButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  registerButtonText: {
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
  loginLinkButton: {
    borderWidth: 1.5,
    borderColor: "#A85603",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  loginLinkText: {
    color: "#A85603",
    fontSize: 16,
    fontWeight: "600",
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 20,
    textAlign: "center",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
    textAlign: "center",
  },
  featureDesc: {
    fontSize: 12,
    color: "#718096",
    textAlign: "center",
    lineHeight: 16,
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
