import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ClozeArticle} from "feature/cloze-article/ClozeArticle";
import {ServicesProvider} from "@/app/providers/ServicesProvider";

const qc = new QueryClient()

function App() {

    return (
        <QueryClientProvider client={qc}>
            <ServicesProvider>
            <div>
                <ClozeArticle
                    slug="0c7af8e9-a543-49b6-a3cb-5c1f872e7bf8"
                    autoCheck
                />
            </div>
                </ServicesProvider>
        </QueryClientProvider>
    )
}

export default App
