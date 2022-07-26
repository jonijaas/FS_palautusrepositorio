import { HospitalEntry } from "../types";
import { Card } from '@material-ui/core';
import Diagnoses from "./Diagnoses";

import { LocalHospital } from "@material-ui/icons";

const Hospital:React.FC<{entry: HospitalEntry}> = ({ entry })=> {
  return (
    <Card variant='outlined'>
      <p>{entry.date} <LocalHospital /></p>
      <i>{entry.description}</i>
      {entry.diagnosisCodes && <Diagnoses diagnosisCodes={entry.diagnosisCodes} />}
      <p>diagnose by {entry.specialist}</p>
      <p><b>discharge:</b> {entry.discharge.date} <i>{entry.discharge.criteria}</i></p>
    </Card>
  );
};

export default Hospital;