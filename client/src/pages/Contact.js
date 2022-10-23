import { useState } from 'react';
import '../css/Contact.css';

const Contact = () => {
    const [form, setForm] = useState({name: '', email: '', message: ''});

    function onChangeName (e) {
        setForm({...form, name: e.currentTarget.value});
    }

    function onChangeEmail (e) {
        setForm({...form, email: e.currentTarget.value});
    }

    function onChangeMessage (e) {
        setForm({...form, message: e.currentTarget.value});
    }

    function handleSubmit(e) {
        e.preventDefault();
        fetch('/send', {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(
            (response) => (response.json())
        ).then((response) => {
            if (response.status === 'success') {
                alert('Message Sent');
                setForm({name: '', email: '', message: ''});
            } else if (response.status === 'fail') {
                alert('Message failed to send');
            }
        })
    }

    return (
        <div className='mainPage contactPage'>
            <h1>Contact</h1>
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <p>&emsp;If you would like to send me a message, here is the spot to do it. Fill out your message and hit submit, and I'll do my best to get back to you as soon as possible.</p>

                <label>Name:</label>
                <input type='text' value={form.name} onChange={(e) => {onChangeName(e)}}/>

                <label>Email:</label>
                <input type='email' value={form.email} onChange={(e) => {onChangeEmail(e)}}/>

                <label>Message:</label>
                <textarea type='text' value={form.message} onChange={(e) => {onChangeMessage(e)}}/>

                <div className='buttonContainer'><button type='submit'>Submit</button></div>
            </form>
        </div>
    );
}

export default Contact;