import { NewPatient, Gender, NewEntry, Diagnose, EntryType, HealthCheckRating, Discharge, SickLeave, NewBaseEntry } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name: ' + name);
  }
  return name;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn: ' + ssn);
  }
  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation: ' + occupation);
  }
  return occupation;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

type Fields = { name: unknown, dateOfBirth: unknown, ssn: unknown, occupation: unknown, gender: unknown };

export const toNewPatient = ({ name, dateOfBirth, ssn, occupation, gender }: Fields): NewPatient => {
  const newPatient: NewPatient = {
    name: parseName(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseSsn(ssn),
    occupation: parseOccupation(occupation),
    gender: parseGender(gender),
    entries: []
  };

  return newPatient;
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description: ' + description);
  }
  return description;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist: ' + specialist);
  }
  return specialist;
};

const parseDiagnosisCodes = (codes: unknown): Array<Diagnose['code']> => {
  if (!Array.isArray(codes) || !codes.every((c) => isString(c))) {
    throw new Error('Incorrect or missing diagnosiscode');
  }
  return codes as Array<Diagnose['code']>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isType = (param: any): param is EntryType => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(EntryType).includes(param);
};

const parseType = (type: unknown): EntryType => {
  if (!type || !isType(type)) {
    throw new Error('Incorrect or missing type: ' + type);
  }
  return type;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseDischarge = (discharge: any): Discharge => {
  if (!discharge) {
    throw new Error('Missing discharge: ');
  }
  return {
    date: parseDate(discharge.date),
    criteria: parseDescription(discharge.criteria)
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return (Object.values(HealthCheckRating).includes(param) || (param.type === 'number' && -1 < param && param < 4));
};

const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
  if ((healthCheckRating != 0 && !healthCheckRating) || !isHealthCheckRating(healthCheckRating)) {
    throw new Error('Incorrect or missing healthCheckRating: ' + healthCheckRating);
  }
  return healthCheckRating;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error('Incorrect or missing employerName: ' + employerName);
  }
  return employerName;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseSickLeave = (sickLeave: any): SickLeave => {
  if (!sickLeave) {
    throw new Error('Missing sickleave!');
  }
  return {
    startDate: parseDate(sickLeave.startDate),
    endDate: parseDate(sickLeave.endDate)
  };
};

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewEntry = (object: any): NewEntry => {
  const baseEntry: NewBaseEntry = {
    description: parseDescription(object.description),
    date: parseDate(object.date),
    specialist: parseSpecialist(object.specialist),
  };
  if (object.diagnosisCodes) {
    baseEntry.diagnosisCodes = parseDiagnosisCodes(object.diagnosisCodes);
  }
  switch (parseType(object.type)) {
    case 'Hospital':
      const newHEntry: NewEntry = {
        ...baseEntry,
        type: EntryType.Hospital,
        discharge: parseDischarge(object.discharge)
      };
      return newHEntry;
    case 'HealthCheck':
      const newCEntry: NewEntry = {
        ...baseEntry,
        type: EntryType.HealthCheck,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
      };
      return newCEntry;
    case 'OccupationalHealthcare':
      const newOEntry: NewEntry = {
        ...baseEntry,
        type: EntryType.OccupationalHealthcare,
        employerName: parseEmployerName(object.employerName),
        sickLeave: parseSickLeave(object.sickLeave)
      };
      return newOEntry;
    default:
      throw new Error('Unhandled discriminated union member:');
  }
};