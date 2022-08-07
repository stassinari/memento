import "twin.macro";
import { Button } from "../components/Button";

export const PublicPageExample: React.FC = () => {
  return (
    <div>
      This is an example of a public page. No Firebase here!
      <Button label="Test" onClick={() => console.log("tes")} />
    </div>
  );
};
