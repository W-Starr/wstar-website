export interface SocialLinks {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
}

export const companyInfo = {
    legalName: "WSTAR Technologies Ltd",
    registrationNumber: "RC 9068117",
};

export const socialLinks: Record<"wstar" | "aceAcad" | "plantiq", SocialLinks> = {
    wstar: {
        linkedin: "https://www.linkedin.com/company/wstartech",
        facebook: "https://www.facebook.com/share/1bxic7RcTT/",
        instagram: "https://www.instagram.com/wstar_1",
    },
    aceAcad: {
        linkedin: "https://www.linkedin.com/showcase/ace-acad",
        facebook: "https://www.facebook.com/share/1KqbUNbNYN/",
        instagram: "https://www.instagram.com/ace_acad_wstar",
    },
    plantiq: {
        linkedin: "https://www.linkedin.com/showcase/plantiq1",
        facebook: "https://www.facebook.com/share/17sPWK3R1p/",
        instagram: "https://www.instagram.com/plantiq_wstar",
    },
};

export const contactEmails = {
    general: "wstar5552@gmail.com",
    aiSolutions: "solutions@wstartech.ng",
};
