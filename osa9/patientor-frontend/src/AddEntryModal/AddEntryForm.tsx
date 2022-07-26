//import { Form } from "formik";
import React from 'react';
import { NewEntry, EntryType } from '../types';
import HealthCheckEntryForm from "./HealthCheckEntryForm";
import HospitalEntryForm from './HospitalEntryForm';
import OccupationalHealthcareEntryForm from './OccupationalHealthcareEntryForm';
import { FormControl, Radio, RadioGroup, FormLabel, FormControlLabel } from '@mui/material';

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
}

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [value, setValue] = React.useState(EntryType.HealthCheck);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if ((event.target as HTMLInputElement).value === 'HealthCheck') {
      setValue(EntryType.HealthCheck);
    } else if ((event.target as HTMLInputElement).value === 'Hospital') {
      setValue(EntryType.Hospital);
    } else if ((event.target as HTMLInputElement).value === 'OccupationalHealthcare') {
      setValue(EntryType.OccupationalHealthcare);
    }
  };
  
  return (
    <div>
      <FormControl>
        <FormLabel>Entry type:</FormLabel>
        <RadioGroup row value={value} onChange={handleChange}>
          <FormControlLabel value={EntryType.HealthCheck} control={<Radio />} label="HealthCheck" />
          <FormControlLabel value={EntryType.Hospital} control={<Radio />} label="Hospital" />
          <FormControlLabel value={EntryType.OccupationalHealthcare} control={<Radio />} label="OccupationalHealthcare" />
        </RadioGroup>
      </FormControl>
      {value === EntryType.HealthCheck && <HealthCheckEntryForm onSubmit={onSubmit} onCancel={onCancel}/>}
      {value === EntryType.Hospital && <HospitalEntryForm onSubmit={onSubmit} onCancel={onCancel} />}
      {value === EntryType.OccupationalHealthcare && <OccupationalHealthcareEntryForm onSubmit={onSubmit} onCancel={onCancel}/>}
    </div>
  );
};

export default AddEntryForm;