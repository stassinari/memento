interface GoogleIconProps {
  className?: string;
  colour?: "default" | "current";
}

export const GoogleIcon = ({ className, colour = "current" }: GoogleIconProps) => (
  <svg aria-label="Google" viewBox="0 0 512 512" className={className}>
    <path
      fill={colour === "default" ? "#4285f4" : "currentColor"}
      d="M386 400c45-42 65-112 53-179H260v74h102c-4 24-18 44-38 57z"
    />
    <path
      fill={colour === "default" ? "#34a853" : "currentColor"}
      d="M90 341a192 192 0 0 0 296 59l-62-48c-53 35-141 22-171-60z"
    />
    <path
      fill={colour === "default" ? "#fbbc02" : "currentColor"}
      d="M153 292c-8-25-8-48 0-73l-63-49c-23 46-30 111 0 171z"
    />
    <path
      fill={colour === "default" ? "#ea4335" : "currentColor"}
      d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55z"
    />
  </svg>
);
