import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const usePlatform = () => {
    const base_url = import.meta.env.VITE_BASE_URL;

    const {
        data: platforms = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["platforms"],
        queryFn: async () => {
            const res = await axios.get(`${base_url}/platform`);
            return res.data;
        },
    });

    return {
        platforms,
        platformLoading: isLoading,
        isError,
        error,
        platformRefetch: refetch,
    };
};

export default usePlatform;
