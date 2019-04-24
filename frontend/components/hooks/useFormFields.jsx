import { useState } from 'react';

export default initVal => {
  const [fields, setValue] = useState(initVal || {});

  function handleChange(e) {
    const { name, value } = e.target;
    setValue({
      ...fields,
      [name]: value
    });
  }

  return {
    fields,
    onChange: handleChange
  };
};
