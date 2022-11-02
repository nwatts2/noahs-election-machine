import { useState } from 'react';
import Notification from '../components/Notification';
import GoogleAds from '../components/GoogleAds';
import '../css/Contact.css';

const Contact = () => {
    const [form, setForm] = useState({name: '', email: '', message: ''});
    const [notificationText, setNotificationText] = useState('');
    const [isNegative, setIsNegative] = useState(false);
    const [sendTime, setSendTime] = useState(0);
    const [triggerNotification, setTriggerNotification] = useState(0);

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

        const time = Date.now();

        if (time - sendTime > 30000 && form.name !== '' && form.email !== '') {
            setSendTime(time);

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
                    setNotificationText('Message sent');
                    setIsNegative(false);
                    setTriggerNotification((c) => c + 1);
                    setForm({name: '', email: '', message: ''});
                } else if (response.status === 'fail') {
                    setNotificationText('Message failed to send');
                    setIsNegative(true);
                    setTriggerNotification((c) => c + 1);
                }
            })
        } else {
            setNotificationText('Message failed to send');
            setIsNegative(true);
            setTriggerNotification((c) => c + 1);
        }
    }

    return (
        <div className='mainPage contactPage'>
            <Notification trigger={triggerNotification} text={notificationText} isNegative={isNegative}/>
            <h1>Contact</h1>
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <p>&emsp;If you would like to send me a message, here is the spot to do it. Fill out your message and hit submit, and I'll do my best to get back to you as soon as possible.</p>

                <label>*Name:</label>
                <input type='text' value={form.name} onChange={(e) => {onChangeName(e)}} required={true}/>

                <label>*Email:</label>
                <input type='email' value={form.email} onChange={(e) => {onChangeEmail(e)}} required={true}/>

                <label>Message:</label>
                <textarea type='text' value={form.message} onChange={(e) => {onChangeMessage(e)}}/>

                <div className='buttonContainer'><button type='submit'>Submit</button></div>
            </form>
            <GoogleAds />
        </div>
    );
}

export default Contact;