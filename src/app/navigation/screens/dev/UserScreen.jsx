import React from "react";
import { Button, Layout, Text, Icon } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import { AuthManagerProvidersRefresh, useAuth } from "@vactory";

export default function UserScreen() {
  const { isAuthenticated, profile, signIn, signOut } = useAuth();

  return (
    <Layout style={styles.layout} level="4">
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.text}>
          {isAuthenticated ? `Logged in as ${profile?.full_name} ` : "Logged out"}
        </Text>
      </View>

      <Text category="h5" style={{ marginBottom: 15 }}>Sign in using Local Providers</Text>

      <View
        style={{
          flexDirection: "column",
          // alignItems: "center",
          // justifyContent: "center",
        }}
      >
        <Button
          status="basic"
          style={{ marginVertical: 4, marginHorizontal: 4  }}
          onPress={async () => await signIn("local", {
            userId: "john"
          })}
        >
          Local John
        </Button>
        <Button
          status="basic"
          style={{ marginVertical: 4, marginHorizontal: 4 }}
          onPress={async () => await signIn("local", {
            userId: "jane",
            callbackScreen: "Dev"
          })}
        >
          Local Jane with redirect & expire (10s)
        </Button>
      </View>

      <Text category="h5" style={{ marginBottom: 15, marginTop: 15 }}>Sign in using OAuth Providers</Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          // justifyContent: "start",
        }}
      >
        <Button
          status="info"
          accessoryLeft={<Icon name="facebook-outline" />}
          style={{ marginVertical: 8, marginHorizontal: 4  }}
          onPress={async () => await signIn("facebook")}
        >
          Facebook
        </Button>
        <Button
          status="info"
          accessoryLeft={<Icon name="cube-outline" />}
          style={{ marginVertical: 8, marginHorizontal: 4  }}
          onPress={async () => {
            try {
              await signIn("drupal", {
                username: "native@void.fr",
                password: "123456"
              })
            } catch (e) {
              console.log("BUTTON", e)
            }
          }}
        >
          Drupal
        </Button>
      </View>

      <Text category="h5" style={{ marginBottom: 15, marginTop: 15 }}>Debug options</Text>

      <Button
        status="danger"
        onPress={() => signOut()}
      >
        Remove User
      </Button>
      <Button
        status="success"
        style={{ marginVertical: 8 }}
        onPress={() => AuthManagerProvidersRefresh()}
      >
        Refresh Providers
      </Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
  },
  text: {
    fontWeight: "bold",
    fontSize: 30,
    margin: 10,
  },
});
