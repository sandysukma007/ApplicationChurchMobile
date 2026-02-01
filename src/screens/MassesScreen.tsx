import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { supabase } from "../supabaseClient";

type Mass = {
  id: number;
  title: string;
  description: string;
  date: string;
  priest: string;
};

export default function MassesScreen() {
  const [masses, setMasses] = useState<Mass[]>([]);

  const fetchMasses = async () => {
    const { data, error } = await supabase
      .from("masses")
      .select("*")
      .order("date", { ascending: true });
    if (error) {
      console.log("Error fetching masses:", error.message);
    } else {
      setMasses(data);
    }
  };

  useEffect(() => {
    fetchMasses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masses</Text>
      <FlatList
        data={masses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{new Date(item.date).toLocaleString()}</Text>
            <Text>Priest: {item.priest}</Text>
          </View>
        )}
      />
      <Button title="Refresh" onPress={fetchMasses} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
});
