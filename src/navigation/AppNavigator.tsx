import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import React, { useEffect } from "react";
import { Platform } from "react-native";

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
    const handleDeepLink = ({ url }: { url: string }) => {
      if (!url) return;

      console.log("DEEPLINK URL:", url);

      // 👉 Supabase reset password selalu ada type=recovery
      if (url.includes("type=recovery")) {
        if (navigationRef.isReady()) {
          navigationRef.navigate("ResetPassword");
        }
      }
    };

    // app sudah hidup
    const sub = Linking.addEventListener("url", handleDeepLink);

    // app dibuka dari email
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
          headerStyle: { backgroundColor: "#A85603" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "600", fontSize: 18 },
          headerShadowVisible: false,
          animation: Platform.OS === "ios" ? "default" : "slide_from_right",
          contentStyle: { backgroundColor: "#FFF9F0" },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ title: "Buat Akun Baru", headerBackTitle: "" }}
        />

        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Profil Saya", headerBackTitle: "" }}
        />

        <Stack.Screen
          name="Masses"
          component={MassesScreen}
          options={{ title: "Jadwal Misa", headerBackTitle: "" }}
        />

        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ title: "Reset Password" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
