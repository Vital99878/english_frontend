// src/entities/exercise/api/exercise.api.ts
import {HttpClient} from "shared/api/HTTPClient";
import {Exercise, CheckResult} from "@/entities/exercise/types";

export class ExerciseApi {
    private http
    constructor(
        http: HttpClient,
        private buildMetaUrl: (slug: string) => string = (s) => `/api/exercises/${s}`,
        private buildCheckUrl: (slug: string) => string = (s) => `/api/exercises/${s}/check`,
    ) {
        this.http = http
    }

    async getMeta(slug: string): Promise<Exercise> {
        return await this.http.get<Exercise>(this.buildMetaUrl(slug))
    }

    async check(id: string, answers: Record<string, string>): Promise<CheckResult> {
        return await this.http.post<CheckResult>('/api/submissions/cloze', {id, answers})
    }
}


