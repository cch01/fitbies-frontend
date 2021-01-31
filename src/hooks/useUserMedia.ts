import _ from 'lodash';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

interface Constraints {
  width?: number;
  height?: number;
  audio?: boolean;
}

export const useUserMedia = (
  { audio = true, width = 768, height = 1024 }:Constraints,
) => {
  let error: Error;
  const streamRef = useRef<MediaStream>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((camStream) => {
        if (camStream) {
          streamRef.current = camStream;
          setLoading(false);
        }
      }).catch((err) => { error = err; });
    return streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);
  return useMemo(() => ({ error, stream: streamRef.current, loading }), [loading]);
};
