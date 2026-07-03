type AutoMusicProps = {
  src: string;
  volume?: number;
};

export default function AutoMusic({ src, volume = 0.55 }: AutoMusicProps) {
  return (
    <audio
      src={src}
      autoPlay
      loop
      preload="auto"
      ref={(audio) => {
        if (!audio) return;
        audio.volume = volume;
        void audio.play().catch(() => {
          // Browsers can block autoplay until the first user interaction.
        });
      }}
    />
  );
}
