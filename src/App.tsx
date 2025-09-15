import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ClozeArticle} from "feature/ClozeArticle";

const qc = new QueryClient()

function App() {

    return (
        <QueryClientProvider client={qc}>
            <div>
                <ClozeArticle
                    slug="articles-basics-1"
                    template="He is {{a1}} engineer. I go to {{a2|∅}} work. She bought {{a3}} apple. {{a4}} Thames flows through London."
                    ariaLabels={{a1: 'Article 1', a2: 'Article 2 (zero allowed)', a3: 'Article 3', a4: 'Article 4'}}
                    localAnswers={{a1: ['an'], a2: [''], a3: ['an'], a4: ['the']}}
                    autoCheck
                />
            </div>
        </QueryClientProvider>
    )
}

export default App
