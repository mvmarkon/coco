import React, {useEffect,useState}  from 'react';
import '../../css/CoCo.css';
import {useHistory} from "react-router-dom";

const Profile = () => {

  const history = useHistory();
  const [nickName, setNickName] = useState("");
  const [known, setKnown] = useState([]);
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchUsers = async () => {
        debugger;
        const usr = await fetch('/api/users/'+ token)
            .then((res) => res.json())
        setNickName(usr.nickName)
        setKnown(usr.known)
    }
    fetchUsers()
  }, [setKnown]);

  return (
    <div className="App-header">
        <div className="App-title">
          {nickName}
        </div>        
    <div className="btn-group-vertical center">
      {known.map(u=>
        <button key={u._id} type="button" className="btn btn-outline-warning" name= {u.nickName} token={u._id}>
          {u}                            
        </button>
      )}
    </div>
  </div>
  )
}
export default Profile;