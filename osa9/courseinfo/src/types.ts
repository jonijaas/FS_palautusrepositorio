interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CourseDescriptionBase extends CoursePartBase {
  description: string;
}

interface CourseNormalPart extends CourseDescriptionBase {
  type: 'normal';
}

interface CourseProjectPart extends CoursePartBase {
  type: 'groupProject';
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CourseDescriptionBase{
  type: 'submission';
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends CourseDescriptionBase {
  type: 'special';
  requirements: string[]
}

export type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseSpecialPart;

export const assertNever = (value: never): never => {
  throw new Error(`Unhandlerd discriminated union member: ${JSON.stringify(value)}`);
};