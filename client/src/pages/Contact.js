import '../css/Contact.css';

const Contact = () => {
    return (
        <div className='mainPage contactPage'>
            <h1>Contact</h1>
            <form>
                <p>&emsp;If you would like to send me a message, here is the spot to do it. Fill out your message and hit submit, and I'll do my best to get back to you as soon as possible.</p>

                <label>Name:</label>
                <input type='text' />

                <label>Email:</label>
                <input type='email' />

                <label>Message:</label>
                <textarea type='text' />

                <div className='buttonContainer'><button type='submit'>Submit</button></div>
            </form>
        </div>
    );
}

export default Contact;