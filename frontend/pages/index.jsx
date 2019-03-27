import styled from 'styled-components';
import FormContainer from '../components/FormContainer';
import Login from '../components/Login';
import Register from '../components/Register';

const Inner = styled.div`
  margin: 0 auto;
  width: 1200px;
`;

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
      <Inner>
        <FormContainer>
          <AuthFormsStyle>
            <Register className="register" />
            <Login className="login" />
          </AuthFormsStyle>
        </FormContainer>
      </Inner>
    </div>
  );
}

export default Home;
