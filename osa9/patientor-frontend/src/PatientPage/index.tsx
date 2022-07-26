import { useParams } from "react-router-dom";
import { useStateValue, updatePatient } from "../state";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiBaseUrl } from "../constants";
import { Patient, Entry, NewEntry } from "../types";
import Hospital from "./Hospital";
import OccupationalHealthcare from "./OccupationalHealthcare";
import HealthCheck from "./HealthCheck";

import AddEntryModal from "../AddEntryModal";

import { Male, Female, Person } from '@mui/icons-material';
import { Button } from "@material-ui/core";

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case 'Hospital':
      return <Hospital entry={entry} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcare entry={entry} />;
    case 'HealthCheck':
      return <HealthCheck entry={entry} />;
    default:
      throw new Error( `Unhandled discriminated union member: ${JSON.stringify(entry)}`);
  }
};

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, dispatch] = useStateValue();
  const [patient, setPatient] = useState<Patient>();
  const [error, setError] = React.useState<string>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const fetchPatient = async () => {
      try {
        if (id) {
          const { data: patientFromApi } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
          dispatch(updatePatient(patientFromApi));
          setPatient(patientFromApi);
        }
      } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response) setError(String(e.response.data));
        else setError('Unrecognized axios error');
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };
  
  useEffect(() => {
    if (!patient) {
      void fetchPatient();
    }
  }, [id, patient, dispatch]);

  if (!patient) return null;

  const submitNewEntry = async (values: NewEntry) => {
    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${patient.id}/entries`,
        values
      );
      dispatch(updatePatient(updatedPatient));
      closeModal();
      void fetchPatient();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response) setError(String(e.response.data));
        else setError('Unrecognized axios error');
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  const setGender = (patient: Patient) => {
    switch (patient.gender) {
      case 'male':
        return <Male />;
      case 'female':
        return <Female />;
      case 'other':
        return <Person />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div>
        <h2>{patient.name}  {setGender(patient)}</h2>
        <p>
          ssn: {patient.ssn} <br />
          occupation: {patient.occupation}
        </p>
      </div>
      <div>
        <h3>entries</h3>
        {patient.entries.map(e => (
          <div key={e.id}>
            <EntryDetails entry={e} />
          </div>
        ))}
      </div>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default PatientPage;