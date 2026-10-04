import { Stack } from "expo-router";
import FollowingScreen from "@/features/channel/screens/FollowingChannelScreen";

export default function FollowingRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Following", headerShown: false }} />
      <FollowingScreen />
    </>
  );
}