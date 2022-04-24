import { useUser } from "reactfire";
import tw from "twin.macro";

export const Gags = () => {
  const { data: user } = useUser();
  console.log(user);

  return (
    <div>
      Gags are private
      <button className="" css={[tw`btn btn-sm`]}>
        Button
      </button>
    </div>
  );
};
