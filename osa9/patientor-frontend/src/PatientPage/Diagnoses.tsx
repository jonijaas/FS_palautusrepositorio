import { useStateValue } from "../state";
import { Diagnosis } from "../types";

const Diagnoses: React.FC<{ diagnosisCodes: Array<Diagnosis['code']> }> = ({ diagnosisCodes }) => {
  const [{ diagnoses, }] = useStateValue();
  return (
    <ul>
      {diagnosisCodes.map(c => <li key={c}>{c} {diagnoses[c] && diagnoses[c].name}</li>)}
    </ul>
  );
};

export default Diagnoses;