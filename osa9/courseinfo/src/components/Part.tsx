import { CoursePart, assertNever } from "../types";

interface PartProps {
  coursePart: CoursePart;
}

const Part = (props: PartProps) => {
  switch (props.coursePart.type) {
    case 'normal':
      return (
        <p>
          <b>{props.coursePart.name} {props.coursePart.exerciseCount}</b> <br />
          <i>{props.coursePart.description}</i>
        </p>
      )
    case 'groupProject':
      return (
        <p>
          <b>{props.coursePart.name} {props.coursePart.exerciseCount}</b> <br />
          project exercises {props.coursePart.groupProjectCount}
        </p>
      )
    case 'submission':
      return (
        <p>
          <b>{props.coursePart.name} {props.coursePart.exerciseCount}</b> <br />
          <i>{props.coursePart.description}</i> <br />
          submit to {props.coursePart.exerciseSubmissionLink}
        </p>
      )
    case 'special':
      return (
        <p>
          <b>{props.coursePart.name} {props.coursePart.exerciseCount}</b> <br />
          <i>{props.coursePart.description}</i> <br />
          required skills: {props.coursePart.requirements.join(', ')}
        </p>
      )
    default:
      return assertNever(props.coursePart);
  }
}

export default Part;