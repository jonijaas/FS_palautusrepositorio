import { useSelector } from "react-redux"

const Notification = () => {
  const notification = useSelector(state => state.notifications)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  
  if(notification.message === null){
    return null
  } else {
    return (
      <div style={style}>
        {notification.message}
      </div>
    )
  }
}

export default Notification