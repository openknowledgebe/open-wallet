import { useState } from 'react';

export default initVal => {
  const [value, setValue] = useState(initVal);

  function handleChange(e) {
    setValue(e.target.value);
  }

  return {
    value,
    onChange: handleChange
  };
};
