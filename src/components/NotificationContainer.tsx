import { Toaster } from "react-hot-toast";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { useTheme } from "~/hooks/useTheme";

export const NotificationContainer = () => {
  const isMd = useScreenMediaQuery("md");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const themedToastStyle = {
    borderRadius: "0.5rem",
    border: isDark ? "1px solid rgb(255 255 255 / 0.1)" : "1px solid rgb(0 0 0 / 0.05)",
    background: isDark ? "rgb(31 41 55)" : "rgb(255 255 255)",
    color: isDark ? "rgb(243 244 246)" : "rgb(17 24 39)",
  };

  return (
    <Toaster
      position={isMd ? "top-right" : "bottom-center"}
      gutter={12}
      toastOptions={{
        blank: { className: "shadow-lg", style: themedToastStyle },
        success: { className: "shadow-lg", style: themedToastStyle },
        error: { className: "shadow-lg", style: themedToastStyle },
        loading: { className: "shadow-lg", style: themedToastStyle },
      }}
      containerStyle={
        isMd
          ? { top: "1.5rem", right: "1rem" }
          : {
              bottom: `calc(env(safe-area-inset-bottom) + 3.5rem + 1rem)`,
            }
      }
    />
  );
};
