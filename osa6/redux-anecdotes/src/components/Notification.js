import { connect } from "react-redux"

const Notification = (props) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  
  if(props.notification.message === null){
    return null
  } else {
    return (
      <div style={style}>
        {props.notification.message}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    notification: state.notifications
  }
}

export default connect(mapStateToProps)(Notification)