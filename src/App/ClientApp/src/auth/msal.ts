import {PublicClientApplication, SilentRequest} from "@azure/msal-browser";
import {IMsalContext} from "@azure/msal-react";

const msalConfig = {
    auth: {
        clientId: "94c638dd-2ff0-468b-89f5-edf84735241c",
        authority: "https://login.microsoftonline.com/16e04e4f-42c3-445b-9884-605e3bacbeee",
        redirectUri: "https://localhost:44489/",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: ["User.Read"]
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};

export const msalInstance = new PublicClientApplication(msalConfig);

export function getAuthToken({instance, accounts}: IMsalContext) {
    const request: SilentRequest = {
        ...loginRequest,
        account: accounts[0]
    };

    return instance.acquireTokenSilent(request).then((response) => {
        return response.accessToken;
    }).catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
            return response.accessToken;
        });
    });
}