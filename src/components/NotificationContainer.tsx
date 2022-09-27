import { Toaster } from "react-hot-toast";
import { theme } from "twin.macro";
import useMediaQuery from "../hooks/useMediaQuery";

export const NotificationContainer = () => {
  const isMd = useMediaQuery(`(min-width: ${theme`screens.md`})`);

  return (
    <Toaster
      position={isMd ? "top-right" : "bottom-center"}
      containerStyle={{
        ...(isMd
          ? { top: theme`spacing.6`, right: theme`spacing.6` }
          : {
              bottom: `calc(env(safe-area-inset-bottom) + ${theme`spacing.14`} + ${theme`spacing.4`})`,
            }),
      }}
    />
  );
};
