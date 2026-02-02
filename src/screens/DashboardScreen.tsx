import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../supabaseClient";

export default function DashboardScreen({ route, navigation }: any) {
  const role = route.params?.role || "jemaat";
  const isAdmin = role === "admin";

  const [fullName, setFullName] = useState<string | null>(null);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  const handleLogout = async () => {
    Alert.alert("Konfirmasi Logout", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) Alert.alert("Error", error.message);
          else
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
        },
      },
    ]);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return;

      // Ambil data dari tabel users
      const { data: userData, error: userFetchError } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (userFetchError || !userData) return;

      setFullName(userData.full_name);

      // Ambil data dari tabel profiles untuk cek kelengkapan
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile || profileError) return;

      const requiredFields = [
        "birth_date",
        "baptism_date",
        "family_card_number",
        "region",
        "community",
      ];
      const incomplete = requiredFields.some((f) => !profile[f]);
      setProfileIncomplete(incomplete);
    };

    fetchProfile();
  }, []);

  const menuItems = [
    {
      id: 1,
      title: "Jadwal Misa",
      icon: "✝️",
      screen: "Masses",
      color: "#4299E1",
      description: "Lihat jadwal misa harian & mingguan",
    },
    {
      id: 2,
      title: "Pengumuman",
      icon: "📢",
      screen: "Announcements",
      color: "#ED8936",
      description: "Berita & pengumuman terbaru",
    },
    {
      id: 3,
      title: "Acara Paroki",
      icon: "📅",
      screen: "Events",
      color: "#48BB78",
      description: "Kegiatan dan acara mendatang",
    },
    {
      id: 4,
      title: "Renungan Harian",
      icon: "📖",
      screen: "Reflections",
      color: "#9F7AEA",
      description: "Bacaan dan renungan rohani",
    },
    {
      id: 5,
      title: "Donasi",
      icon: "❤️",
      screen: "Donations",
      color: "#F56565",
      description: "Dukungan untuk paroki",
    },
    {
      id: 6,
      title: "Galeri Media",
      icon: "🖼️",
      screen: "Media",
      color: "#38B2AC",
      description: "Foto & video kegiatan",
    },
  ];

  const adminItems = [
    {
      id: 7,
      title: "Kelola Konten",
      icon: "⚙️",
      screen: "Admin",
      color: "#4A5568",
      description: "Kelola jadwal & pengumuman",
      badge: "Admin",
    },
  ];

  const handleMenuItemPress = (screen: string) => {
    if (screen === "Admin")
      Alert.alert("Panel Admin", "Fitur admin akan segera hadir!");
    else navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4299E1" barStyle="light-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userRole}>
              {fullName
                ? fullName
                : "Umat " + role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={handleProfilePress}>
            <Text style={styles.avatarText}>SC</Text>
          </TouchableOpacity>
        </View>

        {/* Warning profile */}
        {profileIncomplete && (
          <View
            style={{
              backgroundColor: "#F56565",
              padding: 10,
              margin: 10,
              borderRadius: 6,
            }}
          >
            <Text
              style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
            >
              Profil Anda belum lengkap! Lengkapi data untuk pengalaman terbaik.
            </Text>
          </View>
        )}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Misa Minggu Ini</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Pengumuman Baru</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Acara Mendatang</Text>
          </View>
        </View>

        {/* Main Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu Utama</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuCard, { borderTopColor: item.color }]}
                onPress={() => handleMenuItemPress(item.screen)}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Admin panel */}
        {isAdmin && (
          <View style={styles.section}>
            <View style={styles.adminHeader}>
              <Text style={styles.sectionTitle}>Panel Admin</Text>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            </View>
            <View style={styles.menuGrid}>
              {adminItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuCard,
                    styles.adminCard,
                    { borderTopColor: item.color },
                  ]}
                  onPress={() => handleMenuItemPress(item.screen)}
                >
                  <View style={styles.adminCardHeader}>
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                    <View style={styles.itemBadge}>
                      <Text style={styles.itemBadgeText}>{item.badge}</Text>
                    </View>
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Paroki Santa Clara Bekasi</Text>
          <Text style={styles.footerSubText}>Versi 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    color: "#718096",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4299E1",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F56565",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4299E1",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#718096",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 16,
  },
  adminHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  adminBadge: {
    backgroundColor: "#F56565",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderTopWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  adminCard: {
    backgroundColor: "#F7FAFC",
  },
  adminCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemBadge: {
    backgroundColor: "#E53E3E",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  itemBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: "#718096",
    lineHeight: 16,
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EDF2F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2D3748",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#A0AEC0",
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  settingsIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 40,
    textAlign: "center",
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2D3748",
    marginBottom: 2,
  },
  settingsDescription: {
    fontSize: 13,
    color: "#718096",
  },
  settingsArrow: {
    fontSize: 24,
    color: "#A0AEC0",
    fontWeight: "300",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 4,
  },
  footerSubText: {
    fontSize: 12,
    color: "#A0AEC0",
  },
});
