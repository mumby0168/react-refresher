import {getAuthToken, loginRequest} from "../auth/msal";
import {IPublicClientApplication} from "@azure/msal-browser";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import {callMsGraph} from "../api/graph";
import {useState} from "react";

export function HomePage() {
    const isAuthed = useIsAuthenticated();
    const context = useMsal();
    const [graphData, setGraphData] = useState<any>(null);

    const handleLogin = (instance: IPublicClientApplication) => {
        instance.loginRedirect(loginRequest).catch(e => {
            console.error(e);
        });
    }

    const handleLogout = (instance: IPublicClientApplication) => {
        instance.logout().catch(e => {
            console.error(e);
        });
    }


    if (isAuthed && !graphData) {
        getAuthToken(context)
            .then((token: any) => {
                callMsGraph(token).then(response => setGraphData(response));
            })
    }

    const welcomeMessage = graphData != null
        ? <p>Hello, {graphData.displayName}</p>
        : <div/>

    const loginOrLogout = isAuthed
        ? <div>
            {welcomeMessage}
            <button onClick={() => handleLogout(context.instance)} className='button is-light mt-2'>Logout</button>
        </div>
        : <button onClick={() => handleLogin(context.instance)} className='button is-light'>Login</button>

    console.log(graphData)

    return (
        <section className='hero is-fullheight-with-navbar'>
            <div className='hero-body'>
                <div>
                    <p className='title'>
                        Todo React Application
                    </p>
                    <p className='subtitle'>
                        A simple todo application written in react
                    </p>
                    {loginOrLogout}
                </div>
            </div>
        </section>
    );
}
