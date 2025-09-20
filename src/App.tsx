import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ClozeArticle} from "feature/cloze-article/ClozeArticle";

const qc = new QueryClient()

function App() {

    return (
        <QueryClientProvider client={qc}>
            <div>
                <ClozeArticle
                    slug="0c7af8e9-a543-49b6-a3cb-5c1f872e7bf8"
                    autoCheck
                />
            </div>
        </QueryClientProvider>
    )
}

export default App
