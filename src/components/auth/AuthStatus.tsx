import { Link } from "react-router-dom";
import { useUser } from "reactfire";
import { LogOut } from "../LogOut";

export const AuthStatus = () => {
  const { data: user } = useUser();

  return user ? (
    <div>
      Logged in as: {user.email}
      <LogOut />
    </div>
  ) : (
    <span>
      You are signed out<Link to="login">Log in here</Link>
    </span>
  );
};
