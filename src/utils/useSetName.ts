import {useUserPreference} from '../components/useUserPreference';
function useSetName() {
  const {setDisplayName} = useUserPreference();
  return setDisplayName;
}

export default useSetName;
