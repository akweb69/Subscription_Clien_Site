import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useCouponsData = () => {
    const base_url = import.meta.env.VITE_BASE_URL;

    const {
        data: couponData = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["couponData"],
        queryFn: async () => {
            const res = await axios.get(`${base_url}/coupon`);
            return res.data;
        },
    });

    return {
        couponData,
        couponLoading: isLoading,
        isError,
        error,
        couponRefetch: refetch,
    };
};

export default useCouponsData;
