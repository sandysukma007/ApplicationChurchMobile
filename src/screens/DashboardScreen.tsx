import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

export default function DashboardScreen({ route, navigation }: any) {
  const role = route.params?.role || "jemaat";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard ({role})</Text>

      {role === "admin" && (
        <Button
          title="Manage Masses & Events"
          onPress={() => Alert.alert("Admin features")}
        />
      )}

      <Button
        title="View Masses"
        onPress={() => Alert.alert("Masses screen")}
      />
      <Button
        title="View Announcements"
        onPress={() => Alert.alert("Announcements screen")}
      />

      <Button
        title="View Masses"
        onPress={() => navigation.navigate("Masses")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
});
