import React, {useState}  from 'react';
import '../../css/CoCo.css';
import {useHistory} from "react-router-dom";

const initialData = {nickName: '', password: ''}

const Login = () => {
    const [loginData, setLoginData] = useState(initialData);
    const [loginError, setLoginError] = useState(false);
    const history = useHistory();

    const handleEventChange = (event) =>{
        event.preventDefault();
        setLoginData({
          ...(loginData),
          [event.target.name]: event.target.value,
        });
    };

    const handleConfirm = (event) =>{
        fetch('api/users/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers:{
              'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) throw Error(response.status)
            return response.json()
        })
        .then(res => {
            console.log('Success:', res)
            localStorage.setItem("token", res._id)
            localStorage.setItem("nickName", res.nickName)
            history.push("/Profile")
            window.location.reload()
        })
        .catch(error => {
            console.error('Error:', error)
            setLoginError(true)
        })
    }

    const handleCancel = (event) =>{
        event.preventDefault();
        setLoginData(initialData);
        setLoginError(false)
    }

  return (
    <div className="box Container App-header">
        <div className="FormTitle">
            LOGIN
        </div>

        <form className="Form EventForm">
            <div className="row mb-3 input input">
                <label htmlFor="eventName" className="col-form-label">
                    NickName:
                </label>
                <div className="col-sm-10">
                    <input className="form-control" type="text" id="nickName" name="nickName" value={loginData.nickName} onChange={handleEventChange} required/>
                </div>                
            </div>
            <div className="row mb-3 input input">
                <label htmlFor="password" className="col-form-label">
                    Password:
                </label>
                <div className="col-sm-10">
                    <input className="form-control" type="password" id="password" name="password" value={loginData.password} onChange={handleEventChange} required/>
                </div>                
            </div>
        </form>

        <div className="App-text" hidden={!loginError}>
            El usuario o la contraseña son incorrectos
        </div>
        
        <div className = "ButtonRight">
                <button className="Button ButtonRight" type="submit" onClick = {handleConfirm}>
                    Confirmar
                </button>
            </div>
        <div className = "ButtonLeft">
            <button className="Button ButtonLeft" type="submit" onClick = {handleCancel}>
                Cancelar
            </button>
        </div>
    </div>
  )
}
export default Login;