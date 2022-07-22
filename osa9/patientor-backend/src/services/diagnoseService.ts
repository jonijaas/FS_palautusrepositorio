import diagnoses from '../../data/diagnoseData';

import { Diagnose } from '../types';

const getEntries = (): Array<Diagnose> => {
  return diagnoses;
};

export default {
  getEntries
};