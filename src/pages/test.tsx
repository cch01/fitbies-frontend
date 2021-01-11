import React from 'react';

interface TestProps {
  test?: string 
}

const Test:React.FC<TestProps> = ({test}) => {
  return <div> HIHI, {test} </div>
}

export default Test;

