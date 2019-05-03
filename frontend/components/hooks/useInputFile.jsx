import { useState } from 'react';

export default initVal => {
  const [file, setFile] = useState(initVal);

  function handleChange({ target: { value, files } }) {
    setFile({ value, file: files[0] });
  }

  return {
    file,
    onChange: handleChange
  };
};
