import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useCategory = () => {
    const base_url = import.meta.env.VITE_BASE_URL;

    const {
        data: categoryData = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["categoryData"],
        queryFn: async () => {
            const res = await axios.get(`${base_url}/category`);
            return res.data;
        },
    });

    return {
        categoryData,
        categoryLoading: isLoading,
        isError,
        error,
        categoryRefetch: refetch,
    };
};

export default useCategory;
