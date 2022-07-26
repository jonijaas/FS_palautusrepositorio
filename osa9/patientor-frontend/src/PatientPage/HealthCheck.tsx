import { HealthCheckEntry} from "../types";
import { Card } from '@material-ui/core';
import HealthRatingBar from "../components/HealthRatingBar";
import Diagnoses from "./Diagnoses";

import { CalendarMonth } from "@mui/icons-material";

const HealthCheck:React.FC<{entry: HealthCheckEntry}> = ({ entry })=> {
  return (
    <Card variant='outlined'>
      <p>{entry.date} <CalendarMonth /></p>
      <i>{entry.description}</i>
      <HealthRatingBar rating={entry.healthCheckRating} showText={false} />
      {entry.diagnosisCodes && <Diagnoses diagnosisCodes={entry.diagnosisCodes} />}
      <p>diagnose by {entry.specialist}</p>
    </Card>
  );
};

export default HealthCheck;