import { OccupationalHealthcareEntry } from "../types";
import { Card } from '@material-ui/core';
import { Work } from "@mui/icons-material";
import Diagnoses from "./Diagnoses";


const OccupationalHealthcare: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
  return (
    <Card variant='outlined'>
      <p>{entry.date} <Work /> <i>{entry.employerName}</i></p>
      <i>{entry.description}</i>
      {entry.diagnosisCodes && <Diagnoses diagnosisCodes={entry.diagnosisCodes} />}
      <p>diagnose by {entry.specialist}</p>
      <p><b>Sick leave: </b> {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}</p>
    </Card>
  );
};

export default OccupationalHealthcare;