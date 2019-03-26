import FormContainer from '../components/FormContainer';
import Login from '../components/Login';
import Register from '../components/Register';

function Home() {
  return (
    <div>
      Welcome to Next.js!
      <FormContainer>
        <Login />
        <Register />
      </FormContainer>
    </div>
  );
}

export default Home;
