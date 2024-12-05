import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import "react-native-get-random-values";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import Web3Auth, {
  LOGIN_PROVIDER,
  WEB3AUTH_NETWORK,
} from "@web3auth/react-native-sdk";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { useEffect, useState } from "react";
import React from "react";
import * as Crypto from "expo-crypto";

const redirectUrl =
  Constants.appOwnership == AppOwnership.Expo ||
  Constants.appOwnership == AppOwnership.Guest
    ? Linking.createURL("web3auth", {})
    : Linking.createURL("web3auth", { scheme: scheme });

const clientId =
  "BJLLHPe4ge6pRncD7jX5JevbeiJnNobWDYBIbnpmmmqwRc84XnyCW6geWB7Ixc4KTVwaT9w72Jqsrl7aCv2IxlI";

const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: {
    chainConfig: {
      chainNamespace: "solana",
      chainId: "0x1",
      rpcTarget: "https://rpc.ankr.com/solana",
      displayName: "Solana Devnet",
      blockExplorerUrl: "https://explorer.solana.com/",
      ticker: "SOL",
      tickerName: "Solana",
    },
  },
});

const web3auth = new Web3Auth(WebBrowser, SecureStore, {
  clientId,
  network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  redirectUrl,
  privateKeyProvider,
});

console.log("Buffer exists: ", !!global.Buffer);
console.log("crypto exists: ", !!global.crypto);
console.log("crypto.subtle exists: ", !!global.crypto.subtle);

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      console.log("Init--web3--");
      await web3auth.init();
      console.log("ready: ", web3auth.ready);
      console.log("connected: ", web3auth.connected);
      if (web3auth.connected) {
        setLoggedIn(true);
      }
    };
    init();
  }, []);

  console.log("crypto.subtle exists: ", !!global.crypto.subtle);

  const login = async () => {
    try {
      console.log(web3auth.ready);

      if (!web3auth.ready) {
        console.log("Web3auth not initialized");
        return;
      }

      console.log(`Email: ${email}`);

      if (!email) {
        console.log("Enter email first");
        return;
      }

      console.log("Logging in");
      // IMP START - Login
      await web3auth.login({
        loginProvider: LOGIN_PROVIDER.EMAIL_PASSWORDLESS,
        extraLoginOptions: {
          login_hint: email,
        },
      });
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Hello</Text>
      <View>
        <TextInput placeholder="Enter email" onChangeText={setEmail} />
        <Button title="Login with Web3Auth" onPress={login} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
