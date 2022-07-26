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

const HospitalEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        description: '',
        date: '',
        specialist: '',
        type: EntryType.Hospital,
        discharge: { date: '', criteria: '' }
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
            <Typography align="left" variant="h6">
              Discharge:
            </Typography>
            <Field
              label='Date'
              placeholder='YYYY-MM-DD'
              name='discharge.date'
              component={TextField}
            />
            <Field
              label='Criteria'
              placeholder='Criteria'
              name='discharge.criteria'
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

export default HospitalEntryForm;