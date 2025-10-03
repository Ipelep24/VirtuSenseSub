import {useUserPreference} from '../components/useUserPreference';

function useGetName() {
  const {displayName} = useUserPreference();
  return displayName;
}

export default useGetName;
