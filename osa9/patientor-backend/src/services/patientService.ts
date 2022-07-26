import patients from "../../data/patientData";
import { v1 as uuid } from 'uuid';

import { Patient, NonSensitivePatient, NewPatient, NewEntry, Entry } from "../types";

let sPatients = [...patients];

const getEntries = (): Array<Patient> => {
  return sPatients;
};

const getNonSensitiveEntries = (): Array<NonSensitivePatient> => {
  return sPatients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const findById = (id: string): Patient | undefined => {
  const entry = sPatients.find(p => p.id === id);
  return entry;
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry
  };

  sPatients.push(newPatient);
  return newPatient;
};

const addEntry = (patient: Patient, entry: NewEntry): Patient => {
  const newEntry: Entry = { ...entry, id: uuid() };
  const addedPatient = { ...patient, entries: patient.entries.concat(newEntry) };
  sPatients = sPatients.map((p) => p.id === addedPatient.id ? addedPatient : p);
  return addedPatient;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  findById,
  addEntry
};