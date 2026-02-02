import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
    Alert,
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

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
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

      // users.full_name
      const { data: userData } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (userData?.full_name) setFullName(userData.full_name);

      // profiles
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

    // update profiles (AMAN DATE & TEXT)
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
      Alert.alert("Sukses", "Profil berhasil diperbarui");
      navigation.goBack();
    }

    setLoading(false);
  };

  /* ======================
     UI
  ====================== */
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4299E1" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {fullName ? fullName.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>
          </View>

          {/* Form */}
          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} editable={false} />

          <Text style={styles.label}>Jenis Kelamin (male / female)</Text>
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={(v) => setGender(v === "female" ? "female" : "male")}
          />

          <Text style={styles.label}>Tanggal Lahir</Text>
          <TouchableOpacity onPress={() => setShowBirthPicker(true)}>
            <TextInput
              style={styles.input}
              value={birthDate}
              placeholder="Pilih tanggal"
              editable={false}
            />
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

          <Text style={styles.label}>Tanggal Baptis</Text>
          <TouchableOpacity onPress={() => setShowBaptismPicker(true)}>
            <TextInput
              style={styles.input}
              value={baptismDate}
              placeholder="Pilih tanggal"
              editable={false}
            />
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

          <Text style={styles.label}>Alamat</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.label}>No. Telp</Text>
          <TextInput
            style={styles.input}
            value={phone}
            keyboardType="number-pad"
            onChangeText={(text) => {
              const onlyNumber = text.replace(/[^0-9]/g, "");
              setPhone(onlyNumber);
            }}
            maxLength={15}
          />

          <Text style={styles.label}>No. KK Katolik</Text>
          <TextInput
            style={styles.input}
            value={familyCardNumber}
            keyboardType="number-pad"
            onChangeText={(text) => {
              const onlyNumber = text.replace(/[^0-9]/g, "");
              setFamilyCardNumber(onlyNumber);
            }}
            maxLength={20}
          />

          <Text style={styles.label}>Wilayah</Text>
          <TextInput
            style={styles.input}
            value={region}
            onChangeText={setRegion}
          />

          <Text style={styles.label}>Lingkungan</Text>
          <TextInput
            style={styles.input}
            value={community}
            onChangeText={setCommunity}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ======================
   STYLES
====================== */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20 },
  avatarContainer: { alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4299E1",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  label: { fontWeight: "bold", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#4299E1",
    padding: 14,
    borderRadius: 6,
    marginTop: 24,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
});
