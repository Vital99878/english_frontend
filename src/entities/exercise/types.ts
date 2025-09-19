export type ClozeBlank = {
    id: string;
    accept: string[];
    caseSensitive: boolean;
};

export type ClozePayload = {
    text: string;                 // "Yesterday I __b1__ ... __b2__ ..."
    blanks: ClozeBlank[];         // [{id:"b1", ...}, ...]
};

export type Exercise = {
    id: string;
    kind: "cloze";
    prompt: string;
    payload: ClozePayload;
};

export type CheckDetail = {
    blankId: string;
    expected: string[];
    given: string;
    correct: boolean;
};

export type CheckResult = {
    correct: boolean;
    score: number;                // 0..1
    details: CheckDetail[];
};
