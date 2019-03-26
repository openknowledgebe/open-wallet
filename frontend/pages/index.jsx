import styled from 'styled-components';
import FormContainer from '../components/FormContainer';
import Login from '../components/Login';
import Register from '../components/Register';

const AuthFormsStyle = styled.div`
  display: grid;
  grid-template-areas: 'a b';
  column-gap: 20px;
  div:first-child {
    grid-area: a;
  }
  div:last-child {
    grid-area: b;
  }
`;

function Home() {
  return (
    <div>
      Welcome to Next.js!
      <FormContainer>
        <AuthFormsStyle>
          <Register className="register" />
          <Login className="login" />
        </AuthFormsStyle>
      </FormContainer>
    </div>
  );
}

export default Home;
