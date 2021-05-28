import React, {useEffect,useState}  from 'react';
import '../css/CoCo.css';
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
    localStorage.setItem('token', event.target.name)
    history.push("/EventForm")
    window.location.reload()
  }

  return (
    <div className="App-header">
        HOME            
{/*        <img src={logo} className="App-logo" alt="logo" />
        <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
        >
        Learn React
    </a>
    <br />
    <button className="App-link" onClick={getUsers}>Test endpoint</button>
    {users && <ul>
      {users.map(user => <li key={user.name}>{`${user.name}, ${user.age} years old`}</li>)}
    </ul>}*/}

    <div>
      {users.map(u=>
        <button key = {u} onClick ={goToUser} name = {u._id}>
          {u.nickName}                            
        </button>
      )}
    </div>
  </div>
  )
}
export default Start;