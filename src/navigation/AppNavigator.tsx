import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Platform } from "react-native";
// import AnnouncementsScreen from "../screens/AnnouncementsScreen";
import DashboardScreen from "../screens/DashboardScreen";
// import DonationsScreen from "../screens/DonationsScreen";
// import EventsScreen from "../screens/EventsScreen";
import LoginScreen from "../screens/LoginScreen";
import MassesScreen from "../screens/MassesScreen";
// import MediaScreen from "../screens/MediaScreen";
import ProfileScreen from "../screens/ProfileScreen";
// import ReflectionsScreen from "../screens/ReflectionsScreen";
import SignupScreen from "../screens/SignupScreen";

// Define the parameter types for each screen
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: { role: string; fullName?: string };
  Profile: undefined;
  Masses: undefined;
  Announcements: undefined;
  Events: undefined;
  Media: undefined;
  Donations: undefined;
  Reflections: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          // Header styling yang konsisten dengan tema #A85603
          headerStyle: {
            backgroundColor: "#A85603",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
          },
          headerShadowVisible: false,
          // Animation sesuai platform
          animation: Platform.OS === "ios" ? "default" : "slide_from_right",
          // Background color untuk semua screen
          contentStyle: {
            backgroundColor: "#FFF9F0",
          },
        }}
      >
        {/* Login Screen - Tanpa Header */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />

        {/* Signup Screen - Dengan Back Button */}
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            headerShown: true,
            title: "Buat Akun Baru",
            headerBackTitle: "", // Kosongkan untuk iOS
          }}
        />

        {/* Dashboard Screen - Tanpa Header */}
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            headerShown: false,
            // Prevent going back to Login
            gestureEnabled: false,
          }}
        />

        {/* Profile Screen */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "Profil Saya",
            headerBackTitle: "", // Untuk iOS
          }}
        />

        {/* Masses Screen */}
        <Stack.Screen
          name="Masses"
          component={MassesScreen}
          options={{
            title: "Jadwal Misa",
            headerBackTitle: "",
          }}
        />

        {/* Announcements Screen */}
        {/* <Stack.Screen
          name="Announcements"
          component={AnnouncementsScreen}
          options={{
            title: "Pengumuman",
            headerBackTitle: "",
          }}
        /> */}

        {/* Events Screen */}
        {/* <Stack.Screen
          name="Events"
          component={EventsScreen}
          options={{
            title: "Acara Paroki",
            headerBackTitle: "",
          }}
        /> */}

        {/* Media Screen */}
        {/* <Stack.Screen
          name="Media"
          component={MediaScreen}
          options={{
            title: "Galeri Media",
            headerBackTitle: "",
          }}
        /> */}

        {/* Donations Screen */}
        {/* <Stack.Screen
          name="Donations"
          component={DonationsScreen}
          options={{
            title: "Donasi",
            headerBackTitle: "",
          }}
        /> */}

        {/* Reflections Screen */}
        {/* <Stack.Screen
          name="Reflections"
          component={ReflectionsScreen}
          options={{
            title: "Renungan Harian",
            headerBackTitle: "",
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
