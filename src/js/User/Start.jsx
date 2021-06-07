import React, {useEffect,useState}  from 'react';
import '../../css/CoCo.css';
import {useHistory} from "react-router-dom";

const Start = () => {

  const history = useHistory();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usrs = await fetch('/api/users')
        .then((res) => res.json())
      localStorage.clear()
      setUsers(usrs)
    }
    fetchUsers()
  }, [setUsers]);

  const goToUser = (event) =>{
    localStorage.setItem('token', event.target.getAttribute('token'))
    localStorage.setItem('nickName', event.target.name)
    history.push("/EventForm")
    window.location.reload()
  }

  return (
    <div className="App-header">
        <div className="App-title">
          HOME
        </div>        
    <div className="btn-group-vertical center">
      {users.map(u=>
        <button key={u._id} type="button" className="btn btn-outline-warning" onClick ={goToUser} name= {u.nickName} token={u._id}>
          {u.nickName}                            
        </button>
      )}
    </div>
  </div>
  )
}
export default Start;