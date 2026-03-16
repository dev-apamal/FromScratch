import * as Sentry from "@sentry/react-native";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  // Pass true for the outermost boundary that sits outside SafeAreaProvider
  bare?: boolean;
};

type State = {
  hasError: boolean;
  error: Error | null;
  eventId: string | null;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, eventId: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, eventId: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const eventId = Sentry.captureException(error, {
      extra: { componentStack: info.componentStack },
    });
    this.setState({ eventId });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, eventId: null });
  };

  handleGoToShelf = () => {
    this.setState({ hasError: false, error: null, eventId: null });
    router.replace("./(tabs)/");
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    // ── Bare fallback (outer boundary — no SafeAreaProvider above it) ─────────
    if (this.props.bare) {
      return (
        <View
          style={{
            flex: 1,
            paddingTop: 80,
            paddingHorizontal: 32,
            alignItems: "center",
            backgroundColor: "#fef4f2",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "500",
              color: "#471208",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Something went wrong
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#471208",
              opacity: 0.6,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            Please restart The Reading Nook.
          </Text>
        </View>
      );
    }

    // ── Full fallback (inner boundary — SafeAreaProvider is available) ────────
    return (
      <SafeAreaView className="flex-1 bg-pomegranate-50">
        <View className="flex-1 items-center justify-center p-8 gap-6">
          {/* Icon */}
          <View className="w-20 h-20 rounded-full bg-pomegranate-100 items-center justify-center">
            <Text style={{ fontSize: 36 }}>📖</Text>
          </View>

          {/* Message */}
          <View className="items-center gap-2">
            <Text className="text-2xl font-bold text-pomegranate-950 text-center">
              Something went wrong
            </Text>
            <Text className="text-base text-pomegranate-950 opacity-60 text-center leading-relaxed">
              The Reading Nook ran into an unexpected problem. Your reading data
              is safe.
            </Text>
          </View>

          {/* Sentry event ID — helps you find the exact report in your dashboard */}
          {this.state.eventId && (
            <Text className="text-xs text-pomegranate-950 opacity-40 text-center font-mono">
              Report ID: {this.state.eventId}
            </Text>
          )}

          {/* Dev-only error detail */}
          {__DEV__ && this.state.error && (
            <View className="w-full bg-pomegranate-100 rounded-2xl p-4">
              <Text className="text-xs font-bold text-pomegranate-700 mb-1">
                Error (dev only)
              </Text>
              <Text className="text-xs text-pomegranate-950 opacity-70 font-mono">
                {this.state.error.message}
              </Text>
            </View>
          )}

          {/* Actions */}
          <View className="w-full gap-3">
            <Pressable
              onPress={this.handleReset}
              className="w-full bg-pomegranate-500 rounded-full py-4 items-center active:opacity-80"
            >
              <Text className="text-white text-base font-semibold">
                Try again
              </Text>
            </Pressable>
            <Pressable
              onPress={this.handleGoToShelf}
              className="w-full bg-pomegranate-100 rounded-full py-4 items-center active:opacity-80"
            >
              <Text className="text-pomegranate-700 text-base font-semibold">
                Go to shelf
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
