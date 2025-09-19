import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExercise, submitCloze } from "./api";
import type {  Exercise } from "./types";

export const qk = {
    exercise: (id: string) => ["exercise", id] as const,
};

export function useExercise(id: string) {
    return useQuery<Exercise>({
        queryKey: qk.exercise(id),
        queryFn: () => getExercise(id),
        staleTime: 60_000,
    });
}

export function useSubmitCloze() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: submitCloze,
        onSuccess: (_result, vars) => {
            // при желании можно рефетчить упражнение
            qc.invalidateQueries({ queryKey: qk.exercise(vars.exercise_id) });
        },
    });
}
