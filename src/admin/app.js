// @ts-nocheck
import logo from "./extensions/logo.png";
import favicon from "./extensions/favicon.png";
const config = {
    locales: [
        // 'ar',
        // 'fr',
        // 'cs',
        // 'de',
        // 'dk',
        // 'es',
        // 'he',
        // 'id',
        // 'it',
        // 'ja',
        // 'ko',
        // 'ms',
        // 'nl',
        // 'no',
        // 'pl',
        // 'pt-BR',
        // 'pt',
        // 'ru',
        // 'sk',
        // 'sv',
        // 'th',
        // 'tr',
        // 'uk',
        // 'vi',
        // 'zh-Hans',
        // 'zh',
    ],
    auth: {
        logo: logo,
        favicon: favicon
    },
    theme: {
        light: {
            colors: {
                primary500: "#0A71B8",
                primary600: "#096CAE",
                primary700: "#0A71B8",
                buttonPrimary500: "#0A71B8",
                buttonPrimary600: "#096CAE",
            },
        },
        dark: {
            colors: {
                primary600: "#1597F4",
                primary500: "#096CAE",
                primary700: "#1597F4",
                buttonPrimary500: "#0A71B8",
                buttonPrimary600: "#096CAE",

            },
        },

    },
    tutorials: false,
    // Extend the translations
    translations: {
        en: {
            "app.components.LeftMenu.navbrand.title": "Riga Transfer Dashboard",

            "app.components.LeftMenu.navbrand.workplace": "Testing",

            "Auth.form.welcome.title": "Welcome to Riga Transfer",

            "Auth.form.welcome.subtitle": "Login to your account",

            "Settings.profile.form.section.experience.interfaceLanguageHelp": "Preference changes will apply only to you.",
        },
    },
};

const bootstrap = (app) => {
    console.log(app);
};

export default {
    config,
    bootstrap,
};