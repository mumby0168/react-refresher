import {loginRequest} from "../auth/msal";
import {IPublicClientApplication, SilentRequest} from "@azure/msal-browser";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import {callMsGraph} from "../api/graph";
import {useState} from "react";

export function HomePage() {

    const isAuthed = useIsAuthenticated();
    const {instance, accounts} = useMsal();
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

    const requestProfileData = () => {
        const request: SilentRequest = {
            ...loginRequest,
            account: accounts[0],
            redirectUri: `${window.location.href}/blank.html`
        };

        // Silently acquires an access token which is then attached to a request for Microsoft Graph data
        instance.acquireTokenSilent(request).then((response) => {
            callMsGraph(response.accessToken).then(response => setGraphData(response));
        }).catch((e) => {
            instance.acquireTokenPopup(request).then((response) => {
                callMsGraph(response.accessToken).then(response => setGraphData(response));
            });
        });
    }

    if (isAuthed && !graphData) {
        requestProfileData();
    }

    const welcomeMessage = graphData != null
        ? <p>Hello, {graphData.displayName}</p>
        : <div/>

    const loginOrLogout = isAuthed
        ? <div>
            {welcomeMessage}
            <button onClick={() => handleLogout(instance)} className='button is-light mt-2'>Logout</button>
        </div>
        : <button onClick={() => handleLogin(instance)} className='button is-light'>Login</button>

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
