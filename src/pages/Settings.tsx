import { Auth } from "firebase/auth";
import { Link } from "react-router-dom";
import "twin.macro";
import { Button } from "../components/Button";
import { auth } from "../firebaseConfig";
import { useCurrentUser } from "../hooks/useInitUser";

const signOut = async (auth: Auth) => {
  await auth.signOut();
  console.log("signed out");
};

export const Settings = () => {
  const user = useCurrentUser();

  return (
    <div>
      WIP profile page
      <div>Logged in as: {user?.email}</div>
      <Button variant="secondary" onClick={async () => await signOut(auth)}>
        Sign out
      </Button>
      <Button variant="white" as={Link} to="/design-library" tw="sm:hidden">
        Design Library
      </Button>
      {/* <Notifications /> */}
    </div>
  );
};

// FIXME revisit when looking into Firebase notifications
// const Notifications = () => {
//   const [isTokenFound, setTokenFound] = useState(false);
//   return (
//     <div>
//       <h2>Notifications</h2>
//       <p>
//         Status:
//         {isTokenFound && <span>Notification permission enabled 👍🏻</span>}
//         {!isTokenFound && <span>Need notification permission ❗️ </span>}
//       </p>
//       <Button
//         variant="primary"
//         onClick={() => getMessagingToken(setTokenFound)}
//       >
//         Enable notifications
//       </Button>
//     </div>
//   );
// };
