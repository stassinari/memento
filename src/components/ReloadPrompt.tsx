import { ArrowPathIcon } from "@heroicons/react/20/solid";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useRegisterSW } from "virtual:pwa-register/react";
import { notification } from "./Notification";

export const ReloadPrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const showReloadToast = () =>
    notification({
      title: "Reload",
      subtitle: "There is a new version of Memento. Please restart.",
      duration: Infinity,
      Icon: <ArrowPathIcon />,
      showClose: false,
      primaryButton: {
        label: "Reload",
        onClick: (t) => {
          updateServiceWorker(true);
          toast.dismiss(t.id);
          setNeedRefresh(false);
        },
      },
    });

  useEffect(() => {
    if (needRefresh) {
      showReloadToast();
    }
  }, [needRefresh]);
  return <React.Fragment />;
};
