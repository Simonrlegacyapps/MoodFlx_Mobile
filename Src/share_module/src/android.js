import { NativeModules } from "react-native";



export async function openComposer(options = {}) {
    let body = options.body || "";
    let text = options.title || "What app would you like to open?";
    if (options.removeText) {
        text = "";
    }

    if (options.encodeBody) {
        body = encodeURIComponent(body);
    }

    return NativeModules.Email.compose(
        text,
        options.to,
        options.subject || "",
        body,
        options.cc,
        options.bcc,
    );
}