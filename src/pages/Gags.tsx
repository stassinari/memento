import { useUser } from "reactfire";

export const Gags = () => {
  const { data: user } = useUser();
  console.log(user);

  return (
    <div>
      Gags are private
      <button>Button</button>
    </div>
  );
};
