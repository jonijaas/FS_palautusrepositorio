import { Formik, Form, Field } from "formik";
import { DiagnosisSelection } from "../AddPatientModal/FormField";
import { NewEntry, EntryType } from '../types';
import { useStateValue } from '../state/state';
import { TextField } from "../AddPatientModal/FormField";
import { Grid, Button, Typography } from '@material-ui/core';

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
}

const OccupationalHealthcareEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        description: '',
        date: '',
        specialist: '',
        type: EntryType.OccupationalHealthcare,
        employerName: '',
        sickLeave: {startDate: '', endDate: ''}
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (values.type === EntryType.OccupationalHealthcare)
          if(!values.employerName) {
            errors.employerName = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className='form ui'>
            <Field
              label='Description'
              placeholder='Description'
              name='description'
              component={TextField}
            />
            <Field
              label='Date'
              placeholder='YYYY-MM-DD'
              name='date'
              component={TextField}
            />
            <Field
              label='Specialist'
              placeholder='Name of Specialist'
              name='specialist'
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <Field
              label='Employer name'
              placeholder='Name of Employer'
              name='employerName'
              component={TextField}
            />
            <Typography align="left" variant="h6">
              Sick Leave (optional):
            </Typography>
            <Field
              label='Start date'
              placeholder='YYYY-MM-DD'
              name='sickLeave.startDate'
              component={TextField}
            />
            <Field
              label='End date'
              placeholder='YYYY-MM-DD'
              name='sickLeave.endDate'
              component={TextField}
            />
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OccupationalHealthcareEntryForm;