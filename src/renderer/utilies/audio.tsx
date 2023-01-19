import { useMemo, useEffect, useState } from 'react';
// import rain from 'assets/audio/rain.mp3'; --> hardcoded import I've tried

const useAudio = (url: string) => {
  const audio = useMemo(() => new Audio(url), [url]);
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    audio.loop = true;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    playing ? audio.play() : audio.pause();
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, [audio]);

  return [playing, toggle];
};
export default useAudio;
