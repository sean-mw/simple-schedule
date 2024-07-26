import Image from "next/image";

type LogoProps = {
  style: {
    marginRight: number;
  };
};

const Logo: React.FC<LogoProps> = ({ style }) => {
  return (
    <Image
      src="/logo.svg"
      alt="Logo"
      width="0"
      height="0"
      style={{ width: "250px", height: "auto", ...style }}
    />
  );
};

export default Logo;
