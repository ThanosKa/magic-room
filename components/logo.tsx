import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = "", width = 32, height = 32 }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
        <Image
          src="/logo.png"
          alt="Magic Room Logo"
          width={width}
          height={height}
          className="object-contain"
          priority
        />
    </div>
  );
}
