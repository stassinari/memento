import { Toaster } from "react-hot-toast";
import useScreenMediaQuery from "../hooks/useScreenMediaQuery";

export const NotificationContainer = () => {
  const isMd = useScreenMediaQuery("md");

  return (
    <Toaster
      position={isMd ? "top-right" : "bottom-center"}
      containerStyle={{
        ...(isMd
          ? { top: "1.5rem", right: "1rem" }
          : {
              bottom: `calc(env(safe-area-inset-bottom) + 3.5rem + 1rem)`,
            }),
      }}
    />
  );
};
