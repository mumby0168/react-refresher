import {AuthenticatedTemplate, UnauthenticatedTemplate} from "@azure/msal-react";

export function ProtectedPage(props: any) {
    return (
        <div>
            <AuthenticatedTemplate>
                {props.children}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                You must be signed in.
            </UnauthenticatedTemplate>
        </div>
    );
}