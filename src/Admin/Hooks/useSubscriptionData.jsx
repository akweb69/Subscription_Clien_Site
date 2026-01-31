import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useSubscriptionData = () => {
    const base_url = import.meta.env.VITE_BASE_URL;

    const {
        data: subscriptionData = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["subscriptionData"],
        queryFn: async () => {
            const res = await axios.get(`${base_url}/subscription`);
            return res.data;
        },
    });

    return {
        subscriptionData,
        subscriptionLoading: isLoading,
        isError,
        error,
        subscriptionRefetch: refetch,
    };
};

export default useSubscriptionData;
