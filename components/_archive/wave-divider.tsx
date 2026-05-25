interface WaveDividerProps {
  from?: string;
  to?: string;
  flip?: boolean;
}

export const WaveDivider = ({
  from = "#FAF9F6",
  to = "#ffffff",
  flip = false,
}: WaveDividerProps) => {
  return (
    <div
      className={`relative h-12 md:h-16 overflow-hidden ${flip ? "rotate-180" : ""}`}
      style={{ backgroundColor: to }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-full"
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,0 L0,0 Z"
          fill={from}
        />
      </svg>
    </div>
  );
};
