import "@ethersproject/shims";
import "@expo/metro-runtime";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import "./globals";
import "expo-standard-web-crypto";

import { App } from "expo-router/build/qualified-entry";
import { renderRootComponent } from "expo-router/build/renderRootComponent";

renderRootComponent(App);
