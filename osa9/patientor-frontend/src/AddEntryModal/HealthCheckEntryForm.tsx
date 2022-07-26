import { Formik, Form, Field } from "formik";
import { DiagnosisSelection } from "../AddPatientModal/FormField";
import { NewEntry, EntryType } from '../types';
import { useStateValue } from '../state/state';
import { TextField, NumberField } from "../AddPatientModal/FormField";
import { Grid, Button } from '@material-ui/core';

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
}

const HealthCheckEntryForm = ({ onSubmit, onCancel}: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        description: '',
        date: '',
        specialist: '',
        type: EntryType.HealthCheck,
        healthCheckRating: 0
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
        if (values.type === EntryType.HealthCheck)
          if(!values.healthCheckRating) {
            if (!(values.healthCheckRating === 0))
              errors.healthCheckRating = requiredError;
          } else if (values.healthCheckRating < 0 || values.healthCheckRating > 3) {
            errors.healthCheckRating = 'Only values 0, 1, 2 or 3 are allowed!';
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
              label='HealthCheckRating'
              placeholder='0-3'
              name='healthCheckRating'
              component={NumberField}
              min={0}
              max={3}
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

export default HealthCheckEntryForm;