import { ArrowPathIcon } from "@heroicons/react/20/solid";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "./Button";

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

  // FIXME toasts on iPhone

  const showReloadToast = () =>
    toast.loading(
      (t) => (
        <span tw="flex gap-2.5 items-center">
          The app need restarting
          <Button
            variant="primary"
            size="xs"
            onClick={() => {
              updateServiceWorker(true);
              toast.dismiss(t.id);
              setNeedRefresh(false);
            }}
          >
            Restart
          </Button>
        </span>
      ),
      {
        icon: <ArrowPathIcon tw="w-5 h-5" />,
      }
    );

  useEffect(() => {
    if (needRefresh) {
      showReloadToast();
    }
  }, [needRefresh]);
  return <React.Fragment />;
};
