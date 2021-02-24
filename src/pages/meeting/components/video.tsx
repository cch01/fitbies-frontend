import React, {
  useRef, useEffect, DetailedHTMLProps, VideoHTMLAttributes,
} from 'react';

interface VideoProps {
  stream: any;
  muted?: boolean;
  autoPlay?: boolean;
  [x:string]: any;
}

// TODO add mute / off video btn on right top
const Video:React.FC<VideoProps> = ({
  stream, muted = false, autoPlay = true, ...props
}) => {
  const element = useRef<any>(null);

  useEffect(() => {
    if (element.current && stream) {
      element.current.srcObject = stream;
    }
  }, [stream, element]);

  return <video {...props} autoPlay={autoPlay} muted={muted} ref={element} />;
};

export default Video;
