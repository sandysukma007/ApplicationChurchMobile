import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Platform } from "react-native";

import * as Linking from "expo-linking";
import { supabase } from "../supabaseClient";

import DashboardScreen from "../screens/DashboardScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import LoginScreen from "../screens/LoginScreen";
import MassesScreen from "../screens/MassesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import SignupScreen from "../screens/SignupScreen";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: { role: string; fullName?: string };
  Profile: undefined;
  Masses: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      if (!url) return;

      // DEBUG (penting)
      console.log("DEEPLINK URL:", url);

      // ⬇️ Supabase AUTO handle recovery dari URL fragment
      const { data, error } = await supabase.auth.getSession();

      if (!error && data.session && navigationRef.isReady()) {
        navigationRef.navigate("ResetPassword");
      }
    };

    // app sedang hidup
    const sub = Linking.addEventListener("url", handleDeepLink);

    // app baru dibuka dari email
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => sub.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
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

        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
