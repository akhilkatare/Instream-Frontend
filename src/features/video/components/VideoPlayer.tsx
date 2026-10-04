import { useEffect, useRef } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import * as ScreenOrientation from "expo-screen-orientation";

export function VideoPlayer({ uri }: { uri: string }) {
  const ref = useRef<VideoView>(null);
  const isFullscreen = useRef(false);

  const player = useVideoPlayer(uri, (p) => {
    p.play();
  });

  useEffect(() => {
    ScreenOrientation.unlockAsync();

    const sub = ScreenOrientation.addOrientationChangeListener((e) => {
      const o = e.orientationInfo.orientation;
      const landscape =
        o === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

      // Guard so entering fullscreen (which itself fires events) doesn't loop.
      if (landscape && !isFullscreen.current) {
        isFullscreen.current = true;
        ref.current?.enterFullscreen();
      } else if (!landscape && isFullscreen.current) {
        isFullscreen.current = false;
        ref.current?.exitFullscreen();
      }
    });

    return () => {
      sub.remove();
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  return (
    <VideoView
      ref={ref}
      player={player}
      style={{ width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000" }}
      nativeControls
      contentFit="contain"
      onFullscreenExit={() => {
        isFullscreen.current = false;
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      }}
    />
  );
}