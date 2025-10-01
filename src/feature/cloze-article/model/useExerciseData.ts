import {useMemo} from "react";
import {UseQueryResult} from "@tanstack/react-query";
import {Exercise} from "@/entities/exercise/types";

type UseExerciseDataResult = {
    exercise: Exercise | undefined;
    payload: Exercise['payload'] | undefined;
    isLoading: boolean;
    error: Error | null;
};

export default function useExerciseData(metaQuery: UseQueryResult<Exercise, Error>): UseExerciseDataResult {
    const {data, isPending, error} = metaQuery;

    const payload = useMemo(() => data?.payload, [data]);

    return {
        exercise: data,
        payload,
        isLoading: isPending,
        error: error ?? null,
    };
}
