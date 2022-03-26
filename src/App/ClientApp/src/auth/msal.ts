import {Configuration, PublicClientApplication, SilentRequest} from "@azure/msal-browser";
import {IMsalContext} from "@azure/msal-react";

const msalConfig: Configuration = {
    auth: {
        clientId: "f017ce62-d773-4f13-849c-37139ba9055a",
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
        account: accounts[0],
    };

    return instance.acquireTokenSilent(request).then((response) => {
        return response.accessToken;
    }).catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
            return response.accessToken;
        });
    });
}

export function getAPIAuthToken({instance, accounts}: IMsalContext) {
    const request: SilentRequest = {
        scopes: ['api://bc65b5b2-ded0-4a95-9753-b4dcd295e880/Api.Access'],
        account: accounts[0],
    };

    return instance.acquireTokenSilent(request).then((response) => {
        return response.accessToken;
    }).catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
            return response.accessToken;
        });
    });
}