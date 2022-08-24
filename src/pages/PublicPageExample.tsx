import "twin.macro";
import { Button } from "../components/Button";

export const PublicPageExample: React.FC = () => {
  return (
    <div>
      This is an example of a public page. No Firebase here!
      <Button
        variant="primary"
        label="Test"
        onClick={() => console.log("tes")}
      />
    </div>
  );
};
