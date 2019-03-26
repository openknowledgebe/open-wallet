import FormContainer from '../components/FormContainer';
import Login from '../components/Login';

function Home() {
  return (
    <div>
      Welcome to Next.js!
      <FormContainer>
        <Login />
      </FormContainer>
    </div>
  );
}

export default Home;
