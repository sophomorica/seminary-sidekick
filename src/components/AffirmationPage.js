import { React } from "react";
import { useSelector } from "react-redux";

const AffirmationPage = () => {
  const affirmation = useSelector((state) => state.affirmation);
  return (
    <div>
      <h1>{affirmation}</h1>
    </div>
  );
}
export default AffirmationPage;