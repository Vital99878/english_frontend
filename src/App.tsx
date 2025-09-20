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
                    slug="37455260-afc2-4d0a-a0c7-d83709c7beb5"
                />
            </div>
                </ServicesProvider>
        </QueryClientProvider>
    )
}

export default App
