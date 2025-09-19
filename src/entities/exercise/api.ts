import { api } from "@/shared/api/axios";
import type { Exercise, CheckResult } from "./types";

export async function getExercise(id: string): Promise<Exercise> {
    const { data } = await api.get<Exercise>(`/api/exercises/${id}`);
    return data;
}

export async function submitCloze(input: {
    exercise_id: string;
    answers: Record<string, string>;
}): Promise<CheckResult> {
    const { data } = await api.post<CheckResult>(`/api/submissions/cloze`, input);
    return data;
}
