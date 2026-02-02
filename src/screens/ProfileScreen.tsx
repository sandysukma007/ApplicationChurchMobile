import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
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

/* ======================
   HELPER NORMALIZER
====================== */
const normalizeText = (v?: string) => (v && v.trim() !== "" ? v.trim() : null);
const normalizeDate = (v?: string) =>
  v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;

export default function ProfileScreen({ navigation }: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [birthDate, setBirthDate] = useState("");
  const [baptismDate, setBaptismDate] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [familyCardNumber, setFamilyCardNumber] = useState("");
  const [region, setRegion] = useState("");
  const [community, setCommunity] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBirthPicker, setShowBirthPicker] = useState(false);
  const [showBaptismPicker, setShowBaptismPicker] = useState(false);

  // Color palette based on #A85603 (warm orange/brown)
  const primaryColor = "#A85603";
  const primaryLight = "#FF8C42";
  const backgroundColor = "#FFF9F0";
  const cardBackground = "#FFFFFF";
  const textPrimary = "#2C3E50";
  const textSecondary = "#7F8C8D";
  const successColor = "#27AE60";
  const borderColor = "#E2E8F0";

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  /* ======================
     FETCH PROFILE
  ====================== */
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? "");

      const { data: userData } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (userData?.full_name) setFullName(userData.full_name);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile) return;

      setGender(profile.gender ?? "male");
      setBirthDate(profile.birth_date ?? "");
      setBaptismDate(profile.baptism_date ?? "");
      setAddress(profile.address ?? "");
      setPhone(profile.phone ?? "");
      setFamilyCardNumber(profile.family_card_number ?? "");
      setRegion(profile.region ?? "");
      setCommunity(profile.community ?? "");
    };

    fetchProfile();
  }, []);

  /* ======================
     SAVE PROFILE
  ====================== */
  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Validasi", "Nama lengkap wajib diisi");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // update users
    const { error: userError } = await supabase
      .from("users")
      .update({ full_name: fullName.trim() })
      .eq("id", user.id);

    if (userError) {
      Alert.alert("Error", userError.message);
      setLoading(false);
      return;
    }

    // update profiles
    const payload = {
      id: user.id,
      gender,
      birth_date: normalizeDate(birthDate),
      baptism_date: normalizeDate(baptismDate),
      address: normalizeText(address),
      phone: normalizeText(phone),
      family_card_number: normalizeText(familyCardNumber),
      region: normalizeText(region),
      community: normalizeText(community),
      updated_at: new Date().toISOString(),
    };

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(payload);

    if (profileError) {
      Alert.alert("Error", profileError.message);
    } else {
      Alert.alert("Berhasil!", "Profil Anda telah berhasil diperbarui", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />

      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Saya</Text>
        <View style={styles.headerPlaceholder} />
      </View> */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View
              style={[
                styles.avatarContainer,
                { backgroundColor: cardBackground },
              ]}
            >
              <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
                <Text style={styles.avatarText}>
                  {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                </Text>
              </View>
              <Text style={styles.avatarName}>{fullName || "Umat Paroki"}</Text>
              <Text style={styles.avatarEmail}>{email}</Text>
              {/* <View style={styles.editAvatarButton}>
                <Text style={styles.editAvatarText}>Ganti Foto</Text>
              </View> */}
            </View>
          </View>

          {/* Form Section */}
          <View
            style={[styles.formSection, { backgroundColor: cardBackground }]}
          >
            <Text style={styles.sectionTitle}>Informasi Pribadi</Text>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor={textSecondary}
              />
            </View>

            {/* Email (Read Only) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.input, styles.readOnlyInput]}>
                <Text style={styles.readOnlyText}>{email}</Text>
              </View>
            </View>

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Jenis Kelamin</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === "male" && styles.genderButtonActive,
                    {
                      borderColor:
                        gender === "male" ? primaryColor : borderColor,
                    },
                  ]}
                  onPress={() => setGender("male")}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === "male" && styles.genderButtonTextActive,
                      {
                        color: gender === "male" ? primaryColor : textSecondary,
                      },
                    ]}
                  >
                    Laki-laki
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === "female" && styles.genderButtonActive,
                    {
                      borderColor:
                        gender === "female" ? primaryColor : borderColor,
                    },
                  ]}
                  onPress={() => setGender("female")}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === "female" && styles.genderButtonTextActive,
                      {
                        color:
                          gender === "female" ? primaryColor : textSecondary,
                      },
                    ]}
                  >
                    Perempuan
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Birth Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tanggal Lahir</Text>
              <TouchableOpacity
                style={styles.dateInputContainer}
                onPress={() => setShowBirthPicker(true)}
              >
                <TextInput
                  style={styles.input}
                  value={formatDisplayDate(birthDate)}
                  placeholder="Pilih tanggal lahir"
                  placeholderTextColor={textSecondary}
                  editable={false}
                />
                <Text style={styles.dateIcon}>📅</Text>
              </TouchableOpacity>
              {showBirthPicker && (
                <DateTimePicker
                  value={birthDate ? new Date(birthDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowBirthPicker(false);
                    if (selectedDate) {
                      setBirthDate(formatDate(selectedDate));
                    }
                  }}
                />
              )}
            </View>

            {/* Baptism Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tanggal Baptis</Text>
              <TouchableOpacity
                style={styles.dateInputContainer}
                onPress={() => setShowBaptismPicker(true)}
              >
                <TextInput
                  style={styles.input}
                  value={formatDisplayDate(baptismDate)}
                  placeholder="Pilih tanggal baptis"
                  placeholderTextColor={textSecondary}
                  editable={false}
                />
                <Text style={styles.dateIcon}>✝️</Text>
              </TouchableOpacity>
              {showBaptismPicker && (
                <DateTimePicker
                  value={baptismDate ? new Date(baptismDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowBaptismPicker(false);
                    if (selectedDate) {
                      setBaptismDate(formatDate(selectedDate));
                    }
                  }}
                />
              )}
            </View>

            {/* Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alamat</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={address}
                onChangeText={setAddress}
                placeholder="Masukkan alamat lengkap"
                placeholderTextColor={textSecondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nomor Telepon</Text>
              <TextInput
                style={styles.input}
                value={phone}
                keyboardType="phone-pad"
                onChangeText={(text) => {
                  const onlyNumber = text.replace(/[^0-9]/g, "");
                  setPhone(onlyNumber);
                }}
                placeholder="Masukkan nomor telepon"
                placeholderTextColor={textSecondary}
                maxLength={15}
              />
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Informasi Paroki
            </Text>

            {/* Family Card Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nomor KK Katolik</Text>
              <TextInput
                style={styles.input}
                value={familyCardNumber}
                keyboardType="number-pad"
                onChangeText={(text) => {
                  const onlyNumber = text.replace(/[^0-9]/g, "");
                  setFamilyCardNumber(onlyNumber);
                }}
                placeholder="Masukkan nomor KK Katolik"
                placeholderTextColor={textSecondary}
                maxLength={20}
              />
            </View>

            {/* Region & Community Row */}
            <View style={styles.rowContainer}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.label}>Wilayah</Text>
                <TextInput
                  style={styles.input}
                  value={region}
                  onChangeText={setRegion}
                  placeholder="Wilayah"
                  placeholderTextColor={textSecondary}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Lingkungan</Text>
                <TextInput
                  style={styles.input}
                  value={community}
                  onChangeText={setCommunity}
                  placeholder="Lingkungan"
                  placeholderTextColor={textSecondary}
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: primaryColor }]}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "🔄 Menyimpan..." : "💾 Simpan Perubahan"}
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Batalkan</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Completion Info */}
          <View
            style={[styles.completionCard, { backgroundColor: cardBackground }]}
          >
            <Text style={styles.completionTitle}>Kelengkapan Profil</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: "65%", backgroundColor: primaryColor },
                ]}
              />
            </View>
            <Text style={styles.completionText}>
              Lengkapi semua data untuk mendapatkan akses penuh ke fitur
              aplikasi
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ======================
   STYLES
====================== */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF5E6",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#A85603",
    fontWeight: "bold",
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
  },
  headerPlaceholder: {
    width: 40,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  avatarSection: {
    marginBottom: 24,
  },
  avatarContainer: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "700",
  },
  avatarName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
    textAlign: "center",
  },
  avatarEmail: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 16,
    textAlign: "center",
  },
  editAvatarButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#FFF5E6",
  },
  editAvatarText: {
    fontSize: 14,
    color: "#A85603",
    fontWeight: "500",
  },
  formSection: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 20,
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
  readOnlyInput: {
    backgroundColor: "#EDF2F7",
    borderColor: "#E2E8F0",
  },
  readOnlyText: {
    color: "#718096",
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  genderButtonActive: {
    backgroundColor: "#FFF5E6",
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  genderButtonTextActive: {
    fontWeight: "600",
  },
  dateInputContainer: {
    position: "relative",
  },
  dateIcon: {
    position: "absolute",
    right: 16,
    top: 16,
    fontSize: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  cancelButtonText: {
    color: "#718096",
    fontSize: 16,
    fontWeight: "600",
  },
  completionCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  completionText: {
    fontSize: 14,
    color: "#718096",
    lineHeight: 20,
  },
});
