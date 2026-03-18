import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useUUID = () => {
  const [uuid, setUUID] = useState('');

  useEffect(() => {
    setUUID(uuidv4());
  }, []);

  return uuid;
};

export default useUUID;
