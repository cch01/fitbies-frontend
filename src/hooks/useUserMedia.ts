import _ from 'lodash';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

interface Constraints {
  width?: number;
  height?: number;
  audio?: boolean;
  video?: boolean;
}

export const useUserMedia = (
  {
    audio = true, width = 640, height = 360, video = true,
  }:Constraints,
) => {
  let error: Error;
  const streamRef = useRef<MediaStream>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (audio || video) && setLoading(true);
    navigator.mediaDevices.getUserMedia({
      video: video && { width, height }, audio,
    })
      .then((camStream) => {
        if (camStream) {
          streamRef.current = camStream;
          setLoading(false);
        }
      }).catch((err) => { error = err; });
    return streamRef.current?.getTracks().forEach((track) => track.stop());
  }, [width, height, audio, video]);
  return useMemo(() => ({ error, stream: streamRef.current, loading }), [loading]);
};
