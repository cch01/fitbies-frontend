import React from 'react';

interface TestProps {
  test?: string
}

const Test:React.FC<TestProps> = ({ test }) => (
  <div>
    HIHI,
    {test}
  </div>
);

export default Test;
