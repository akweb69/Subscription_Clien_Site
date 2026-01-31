import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useSettingsData = () => {
    const base_url = import.meta.env.VITE_BASE_URL;

    const {
        data: settingsData = {},
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["settingsData"],
        queryFn: async () => {
            const res = await axios.get(`${base_url}/settings`);
            return res.data;
        },
    });

    return {
        settingsData,
        settingsLoading: isLoading,
        isError,
        error,
        settingsRefetch: refetch,
    };
};

export default useSettingsData;
