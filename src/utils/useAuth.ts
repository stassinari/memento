import { useEffect, useState } from "react";
import { useAuth as useReactFireAuth } from "reactfire";

export default function useAuth() {
  const reactFireAuth = useReactFireAuth();
  const [authState, setAuthState] = useState({
    authenticated: false,
    initializing: true,
  });

  useEffect(
    () =>
      reactFireAuth.onAuthStateChanged((user) => {
        if (user) {
          setAuthState({
            authenticated: true,
            initializing: false,
          });
        } else {
          setAuthState({
            authenticated: false,
            initializing: false,
          });
        }
      }),
    [reactFireAuth, setAuthState]
  );

  return authState;
}
