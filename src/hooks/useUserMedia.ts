import _ from 'lodash';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

interface Constraints {
  width?: number;
  height?: number;
}

export const useUserMedia = (
  {
    width = 640, height = 360,
  }:Constraints,
) => {
  let error: Error;
  const streamRef = useRef<MediaStream>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: { width, height }, audio: true,
    })
      .then((camStream) => {
        if (camStream) {
          streamRef.current = camStream;
          setLoading(false);
        }
      }).catch((err) => { error = err; });
    return () => streamRef.current?.getTracks().forEach((track) => track.stop());
  }, [width, height]);
  return useMemo(() => ({ error, stream: streamRef.current, loading }), [loading]);
};
