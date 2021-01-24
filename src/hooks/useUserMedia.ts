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
  const [error, setError] = useState();
  const streamRef = useRef<MediaStream>();
  navigator.mediaDevices.getUserMedia({ video: true, audio })
    .then((stream) => {
      if (stream) {
        streamRef.current = stream;
        // vidRef.current && (vidRef.current.srcObject = stream);
      }
    }).catch((err) => { setError(err); });
  return { error, streamRef };
};
