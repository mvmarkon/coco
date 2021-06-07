import React, { useState, useEffect } from 'react';
import '../../css/User/Contacts.css';
import '../../css/CoCo.css';

const Contacs = () => {
    
    const [known, setKnown] = useState([]);
    const [unknown, setUnknown] = useState([]);
    
    const token = localStorage.getItem('token');

	useEffect(() => {
        const fetchKnown = async () => {
			var knw = await fetch('/api/users/acquaintances/'+ token)
			.then(res => res.json())
            var uknw = await fetch('/api/users')
			.then(res => res.json())

            //Get NickNames Unknown
            var difference = uknw.map(usr => (usr._id))
            difference = await fetch('/api/users/idstonicknames',{
                method: 'POST',
                body: JSON.stringify(difference),
                headers:{
                  'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(res => difference = res)

            //Add myself & Get NickNames Known
            knw.push(token)
            knw = await fetch('/api/users/idstonicknames',{
                method: 'POST',
                body: JSON.stringify(knw),
                headers:{
                  'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(res => knw = res)

            //Difference
            difference = difference.filter(({ _id: id1 }) => !knw.some(({ _id: id2 }) => id2 === id1));

            //Remove Myself & Setters
            knw.pop()
            setKnown(knw)
            setUnknown(difference)
        }
        fetchKnown()
    }, [setUnknown])
    
    const addUknown = (event) => {
        const id = event.target.getAttribute('value')
        const nickName = event.target.getAttribute('name')        
        const response = fetch('/api/users/add_acquaintance_to/'+ token, {
          method: 'PUT',
          body: JSON.stringify({id_acquaintance_to_add: id}),
          headers:{
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          console.log('Success:', response)
          userToKnown({_id: id, nickName: nickName})
        })
        .catch(error => console.error('Error:', error))
    }

    const quitKnown = (event) => {
        const id = event.target.getAttribute('value')
        const nickName = event.target.getAttribute('name')
        const response = fetch('/api/users/delete_known_to/'+ token, {
          method: 'PUT',
          body: JSON.stringify({id_acquaintance_to_remove: id}),
          headers:{
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          console.log('Success:', response)
          userToUnknown({_id: id, nickName: nickName})
        })
        .catch(error => console.error('Error:', error))
    }

    const userToUnknown = (user) => {
        const index = known.map(function(u) { return u._id; }).indexOf(user._id);
        const knw = known
        knw.splice(index, 1);
        setKnown(knw)
        setUnknown(prev => ([...prev, ...[user]]));
    }

    const userToKnown = (user) => {
        const index = unknown.map(function(u) { return u._id; }).indexOf(user._id);
        const unkw = unknown
        unkw.splice(index, 1)
        setUnknown(unkw);
        setKnown(prev => ([...prev, ...[user]]))
    }

    return(
    <div className="App-header" > 
        <div className="btn-group-vertical">
            <br/>Unknown
            {unknown.map(uknw => (
                <div key={uknw._id}>
                    <button type="button"  className="btn btn-light buttonFollower" value= {uknw._id}>
                        {uknw.nickName}
                    </button>
                    <button type="button" className="btn btn-success buttonFollower" onClick= {addUknown} value= {uknw._id} name={uknw.nickName}>
                        ADD
                    </button>
                </div>
                ))
            }
        </div>
        <div className="btn-group-vertical">
            <br/>Known
            {known.map(knw => (
                <div key={knw._id}>
                    <button type="button"  className="btn btn-light buttonFollower" value= {knw._id}>
                        {knw.nickName}
                    </button>
                    <button type="button" className="btn btn-danger buttonFollower" onClick= {quitKnown} value= {knw._id} name={knw.nickName}>
                        QUIT
                    </button>
                </div>
                ))
            }
        </div>
    </div>
    );
}

export default Contacs;