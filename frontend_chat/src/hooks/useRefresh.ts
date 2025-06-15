import { useCallback, useState } from "react";

const useRefresh = () => {
  const [state, setState] = useState<object>({});

  const handleRefresh = useCallback(async () => {
    setState({});
  }, []);

  return [state, handleRefresh] as const;
};

export default useRefresh;
