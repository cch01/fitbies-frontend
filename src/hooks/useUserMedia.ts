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
  const [error, setError] = useState();
  const streamRef = useRef<MediaStream>();
  const [loading, setLoading] = useState(true);
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((stream) => {
      if (stream) {
        streamRef.current = stream;
        setLoading(false);
      }
    }).catch((err) => { setError(err); });
  return useMemo(() => ({ error, stream: streamRef.current, loading }), [loading]);
};
