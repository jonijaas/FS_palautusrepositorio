import Part from './Part';
import { CoursePart } from '../types'

interface ContentProps {
  courseParts: CoursePart[]
}

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.courseParts.map(c => <Part key={c.name} coursePart={c} />)}
    </div>
  )
};

export default Content;