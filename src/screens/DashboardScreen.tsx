import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../supabaseClient";
const { width } = Dimensions.get("window");

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

  // Color palette based on #A85603 (warm orange/brown)
  const primaryColor = "#A85603";
  const primaryLight = "#FF8C42";
  const primaryDark = "#8B4513";
  const secondaryColor = "#E67E22";
  const accentColor = "#F39C12";
  const backgroundColor = "#FFF9F0";
  const cardBackground = "#FFFFFF";
  const textPrimary = "#2C3E50";
  const textSecondary = "#7F8C8D";
  const warningColor = "#E74C3C";
  const successColor = "#27AE60";

  const menuItems = [
    {
      id: 1,
      title: "Jadwal Misa",
      icon: "✝️",
      screen: "Masses",
      color: primaryColor,
      description: "Lihat jadwal misa harian & mingguan",
      iconComponent: (
        <FontAwesome5 name="church" size={28} color={primaryColor} />
      ),
    },
    {
      id: 2,
      title: "Pengumuman",
      icon: "📢",
      screen: "Announcements",
      color: secondaryColor,
      description: "Berita & pengumuman terbaru",
      iconComponent: (
        <Ionicons name="megaphone" size={28} color={secondaryColor} />
      ),
    },
    {
      id: 3,
      title: "Acara Paroki",
      icon: "📅",
      screen: "Events",
      color: "#3498DB",
      description: "Kegiatan dan acara mendatang",
      iconComponent: <MaterialIcons name="event" size={28} color="#3498DB" />,
    },
    {
      id: 4,
      title: "Renungan",
      icon: "📖",
      screen: "Reflections",
      color: "#9B59B6",
      description: "Bacaan dan renungan rohani",
      iconComponent: (
        <FontAwesome5 name="book-open" size={28} color="#9B59B6" />
      ),
    },
    {
      id: 5,
      title: "Donasi",
      icon: "❤️",
      screen: "Donations",
      color: "#E74C3C",
      description: "Dukungan untuk paroki",
      iconComponent: (
        <FontAwesome5 name="hand-holding-heart" size={28} color="#E74C3C" />
      ),
    },
    {
      id: 6,
      title: "Galeri",
      icon: "🖼️",
      screen: "Media",
      color: "#2ECC71",
      description: "Foto & video kegiatan",
      iconComponent: <Feather name="image" size={28} color="#2ECC71" />,
    },
  ];

  const adminItems = [
    {
      id: 7,
      title: "Kelola Konten",
      icon: "⚙️",
      screen: "Admin",
      color: "#34495E",
      description: "Kelola jadwal & pengumuman",
      badge: "Admin",
      iconComponent: <Feather name="settings" size={28} color="#34495E" />,
    },
  ];

  const handleMenuItemPress = (screen: string) => {
    if (screen === "Admin")
      Alert.alert("Panel Admin", "Fitur admin akan segera hadir!");
    else navigation.navigate(screen);
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

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section with Gradient */}
        <LinearGradient
          colors={[primaryColor, primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userRole}>
              {fullName ||
                "Umat " + role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleProfilePress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#FFFFFF", "#F5F5F5"]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>SC</Text>
              <View style={styles.onlineIndicator} />
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        {/* Profile Warning */}
        {profileIncomplete && (
          <TouchableOpacity
            style={styles.warningContainer}
            onPress={handleProfilePress}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#FF6B6B", "#EE5A52"]}
              style={styles.warningGradient}
            >
              <MaterialIcons name="warning" size={24} color="#FFFFFF" />
              <View style={styles.warningTextContainer}>
                <Text style={styles.warningTitle}>Profil Belum Lengkap</Text>
                <Text style={styles.warningSubtitle}>
                  Lengkapi data untuk pengalaman terbaik
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Statistik Minggu Ini</Text>
            <TouchableOpacity>
              <Text style={styles.statsViewAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsContainer}>
            {[
              { number: "5", label: "Misa", icon: "✝️" },
              { number: "12", label: "Pengumuman", icon: "📢" },
              { number: "3", label: "Acara", icon: "📅" },
              { number: "24", label: "Partisipan", icon: "👥" },
            ].map((stat, index) => (
              <LinearGradient
                key={index}
                colors={["#FFFFFF", "#FFF5E6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </LinearGradient>
            ))}
          </View>
        </View>

        {/* Main Menu Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Menu Utama</Text>
            <View style={styles.sectionDivider} />
          </View>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuCard}
                onPress={() => handleMenuItemPress(item.screen)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[`${item.color}15`, `${item.color}05`]}
                  style={styles.menuIconContainer}
                >
                  {item.iconComponent}
                </LinearGradient>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
                <View
                  style={[
                    styles.menuIndicator,
                    { backgroundColor: item.color },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Admin Section */}
        {isAdmin && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.adminTitleContainer}>
                <Text style={styles.sectionTitle}>Panel Admin</Text>
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>ADMIN</Text>
                </View>
              </View>
              <View style={styles.sectionDivider} />
            </View>
            <View style={styles.menuGrid}>
              {adminItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuCard, styles.adminCard]}
                  onPress={() => handleMenuItemPress(item.screen)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[`${item.color}20`, `${item.color}10`]}
                    style={styles.menuIconContainer}
                  >
                    {item.iconComponent}
                  </LinearGradient>
                  <View style={styles.adminCardHeader}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <View style={styles.itemBadge}>
                      <Text style={styles.itemBadgeText}>{item.badge}</Text>
                    </View>
                  </View>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                  <View
                    style={[
                      styles.menuIndicator,
                      { backgroundColor: item.color },
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Footer Section */}
        <View style={styles.footer}>
          <LinearGradient
            colors={[`${primaryColor}15`, "transparent"]}
            style={styles.footerGradient}
          >
            <View style={styles.logoutContainer}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#FFFFFF", "#FFF5E6"]}
                  style={styles.logoutButtonInner}
                >
                  <MaterialIcons name="logout" size={20} color={warningColor} />
                  <Text style={styles.logoutText}>Keluar dari Aplikasi</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.footerContent}>
              <View style={styles.footerLogo}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>SC</Text>
                </View>
                <View style={styles.footerTextContainer}>
                  <Text style={styles.footerTitle}>Paroki Santa Clara</Text>
                  <Text style={styles.footerSubtitle}>Bekasi</Text>
                </View>
              </View>
              <Text style={styles.footerVersion}>Versi 1.0.0</Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
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
    opacity: 0.3,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#A85603",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
    fontWeight: "500",
  },
  userRole: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    backdropFilter: "blur(10px)",
  },
  roleBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  avatarContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  avatarText: {
    color: "#A85603",
    fontSize: 20,
    fontWeight: "700",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#27AE60",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  warningContainer: {
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#E74C3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  warningGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  warningTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  warningSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
  },
  statsViewAll: {
    color: "#A85603",
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  statCard: {
    width: (width - 48) / 4,
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#7F8C8D",
    textAlign: "center",
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  adminTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
  },
  sectionDivider: {
    height: 3,
    backgroundColor: "#A85603",
    width: 60,
    borderRadius: 2,
    marginTop: 8,
  },
  adminBadge: {
    backgroundColor: "#E74C3C",
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
    width: (width - 48) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
    overflow: "hidden",
  },
  adminCard: {
    backgroundColor: "#F8F9FA",
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  adminCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  itemBadge: {
    backgroundColor: "#E74C3C",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  itemBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 6,
  },
  menuDescription: {
    fontSize: 13,
    color: "#7F8C8D",
    lineHeight: 18,
  },
  menuIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footer: {
    borderRadius: 24,
    marginBottom: 24,
    overflow: "hidden",
  },
  footerGradient: {
    padding: 24,
    borderRadius: 24,
  },
  logoutContainer: {
    marginBottom: 24,
  },
  logoutButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#E74C3C",
  },
  footerContent: {
    alignItems: "center",
  },
  footerLogo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#A85603",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  footerTextContainer: {
    alignItems: "flex-start",
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 2,
  },
  footerSubtitle: {
    fontSize: 14,
    color: "#A85603",
    fontWeight: "600",
  },
  footerVersion: {
    fontSize: 12,
    color: "#7F8C8D",
  },
});
