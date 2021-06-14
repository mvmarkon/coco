import React, {useState}  from 'react';
import '../../css/CoCo.css';
import {useHistory} from "react-router-dom";

const initialData = {name: '', email: '', nickName: '', password: '', age: ''}

const Register = () => {
    const history = useHistory();
    const [registerData, setRegisterData] = useState(initialData);

    const handleEventChange = (event) => {
        event.preventDefault();
        setRegisterData({
          ...(registerData),
          [event.target.name]: event.target.value,
        });
    };

    const handleConfirm = async (event) =>{
        event.preventDefault();
        const response = await fetch('api/users/', {
            method: 'POST',
            body: JSON.stringify(registerData),
            headers:{
              'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then(response => {
            const res = response
            console.log('Success:', res)
            localStorage.setItem("token", res._id)
            localStorage.setItem("nickName", res.nickName)
            history.push("/Profile")
            window.location.reload()
        })
        .catch(error => console.error('Error:', error))
        return response
    }
    

    const handleCancel = (event) =>{
        event.preventDefault();
        setRegisterData(registerData);
    }

    return (
        <div className="App-header">
            <div className="App-title">
                REGISTER
            </div>

            <form className="Form EventForm">
                <div className="row mb-3 input input">
                    <label htmlFor="eventName" className="col-form-label">
                        Name:
                    </label>
                    <div className="col-sm-10">
                        <input className="form-control" type="text" id="name" name="name" value={registerData.name} onChange={handleEventChange} required/>
                    </div>                
                </div>
                <div className="row mb-3 input input">
                    <label htmlFor="email" class="col-form-label">
                        Email address:
                    </label>
                    <div className="col-sm-10">
                        <input type="email" class="form-control" id="email" aria-describedby="emailHelp" name="email" value={registerData.email} onChange={handleEventChange} required/>
                        <div id="emailHelp" class="form-text">
                            We'll never share your email with anyone else.
                        </div>
                    </div>
                </div>
                <div className="row mb-3 input input">
                    <label htmlFor="email" class="col-form-label">
                        Password:
                    </label>
                    <div className="col-sm-10">
                        <input type="password" id="password" class="form-control" aria-describedby="passwordHelpInline" name="password" value={registerData.password} onChange={handleEventChange} required/>
                        <div id="passwordHelpInline" class="form-text">
                            Must be 8-20 characters long.
                        </div>
                    </div>
                </div>
                <div className="row mb-3 input input">
                    <label htmlFor="nickName" className="col-form-label">
                        NickName:
                    </label>
                    <div className="col-sm-10">
                        <input className="form-control" type="text" id="nickName" name="nickName" value={registerData.nickName} onChange={handleEventChange} required/>
                    </div>                
                </div>
                <div className="row mb-3 input input">
                    <label htmlFor="age" className="col-form-label">
                        Age:
                    </label>
                    <div className="col-sm-10">
                        <input className="form-control" type="text" id="age" name="age" value={registerData.age} onChange={handleEventChange} required/>
                    </div>                
                </div>
            </form>
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

export default Register;