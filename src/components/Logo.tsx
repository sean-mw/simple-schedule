import Image from "next/image";

type LogoProps = {
  style: {
    marginRight: number;
  };
};

const Logo: React.FC<LogoProps> = ({ style }) => {
  return (
    <Image src="/logo.svg" alt="Logo" width={250} height={-1} style={style} />
  );
};

export default Logo;
