"use client";

interface AdBannerProps {
  position: "top" | "bottom" | "sidebar" | "native";
}

export default function AdBanner({ position }: AdBannerProps) {
  const sizeClass = {
    top: "h-[90px] max-w-[728px] sm:block hidden",
    bottom: "h-[90px] max-w-[728px] sm:block hidden",
    sidebar: "h-[250px] w-[300px] hidden lg:block",
    native: "h-[250px] max-w-[728px]",
  }[position];

  const mobileClass = {
    top: "h-[50px] max-w-[320px] sm:hidden block",
    bottom: "h-[100px] max-w-[320px] sm:hidden block",
    sidebar: "",
    native: "",
  }[position];

  const id = `ad-${position}-banner`;

  return (
    <>
      {/* Desktop ad slot */}
      <div className={`mx-auto my-2 ${sizeClass}`}>
        <div
          id={id}
          className="w-full h-full flex items-center justify-center"
          /* ADSTERRA: Replace with your ad unit script for this position */
        />
      </div>
      {/* Mobile ad slot */}
      {mobileClass && (
        <div className={`mx-auto my-2 ${mobileClass}`}>
          <div
            id={`${id}-mobile`}
            className="w-full h-full flex items-center justify-center"
            /* ADSTERRA: Replace with your mobile ad unit script */
          />
        </div>
      )}
    </>
  );
}
