import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.theworkbench.thereadingnook.dev";
  }

  if (IS_PREVIEW) {
    return "com.theworkbench.thereadingnook.preview";
  }

  return "com.theworkbench.thereadingnook";
};

const getAppName = () => {
  if (IS_DEV) {
    return "The Reading Nook (Dev)";
  }

  if (IS_PREVIEW) {
    return "The Reading Nook (Preview)";
  }

  return "The Reading Nook";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "thereadingnook",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/Icon-Default.png",
  scheme: "readlog",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryFileTimestamp",
          NSPrivacyAccessedAPITypeReasons: ["C617.1"],
        },
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryDiskSpace",
          NSPrivacyAccessedAPITypeReasons: ["E174.1"],
        },
        {
          NSPrivacyAccessedAPIType:
            "NSPrivacyAccessedAPICategorySystemBootTime",
          NSPrivacyAccessedAPITypeReasons: ["35F9.1"],
        },
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
          NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
        },
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryFileTimestamp",
          NSPrivacyAccessedAPITypeReasons: ["C617.1"],
        },
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryDiskSpace",
          NSPrivacyAccessedAPITypeReasons: ["E174.1"],
        },
        {
          NSPrivacyAccessedAPIType:
            "NSPrivacyAccessedAPICategorySystemBootTime",
          NSPrivacyAccessedAPITypeReasons: ["35F9.1"],
        },
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
          NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
        },
      ],
    },
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#fef4f2",
      foregroundImage: "./assets/images/Icon-Default.png",
      backgroundImage: "./assets/images/Icon-Default.png",
      monochromeImage: "./assets/images/Icon-Default.png",
    },
    package: getUniqueIdentifier(),
    // @ts-ignore - edgeToEdgeEnabled added in newer @expo/config-types
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: "static",
    favicon: "./assets/images/Icon-Default.png",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#fef4f2",
        image: "./assets/images/Icon-Default.png",
        dark: {
          image: "./assets/images/Icon-Default-Dark.png",
          backgroundColor: "#fef4f2",
        },
        imageWidth: 200,
      },
    ],
    "expo-sqlite",
    "expo-font",
    "expo-image",
    "expo-web-browser",
    [
      "@sentry/react-native/expo",
      {
        url: "https://sentry.io/",
        project: "react-native",
        organization: "design-by-ap",
      },
    ],
    [
      "@sentry/react-native/expo",
      {
        url: "https://sentry.io/",
        project: "the-reading-nook",
        organization: "design-by-ap",
      },
    ],
    "@sentry/react-native",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "9cd245ef-6492-4d73-ac6e-03b5aa08bacc",
    },
  },
});
