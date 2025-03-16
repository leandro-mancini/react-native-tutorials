import React from "react";
import { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";

const { width } = Dimensions.get("window");

export const WelcomeScreen = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const pagerRef = React.useRef<PagerView>(null);

    const goToPage = (index: number) => {
        pagerRef.current?.setPage(index);
        setPageIndex(index);
    };

    return (
        <View style={styles.container}>
          <PagerView
            style={styles.pagerView}
            initialPage={0}
            ref={pagerRef}
            onPageSelected={(e) => setPageIndex(e.nativeEvent.position)}
          >
            <View key="1" style={[styles.page, { backgroundColor: "#FFCC80" }]}>
              <Text style={styles.text}>Página 1</Text>
            </View>
            <View key="2" style={[styles.page, { backgroundColor: "#90CAF9" }]}>
              <Text style={styles.text}>Página 2</Text>
            </View>
            <View key="3" style={[styles.page, { backgroundColor: "#A5D6A7" }]}>
              <Text style={styles.text}>Página 3</Text>
            </View>
          </PagerView>
    
          <View style={styles.buttons}>
            <Button title="← Anterior" onPress={() => goToPage(Math.max(0, pageIndex - 1))} />
            <Button title="Próximo →" onPress={() => goToPage(Math.min(2, pageIndex + 1))} />
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    pagerView: { flex: 1 },
    page: {
      justifyContent: "center",
      alignItems: "center",
      width,
    },
    text: { fontSize: 24, fontWeight: "bold", color: "#333" },
    buttons: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
    },
});