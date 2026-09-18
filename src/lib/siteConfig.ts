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

// AI Solutions leads with the corporate WSTAR contact address (solutions@wstartech.ng
// has not been confirmed as a live, monitored inbox yet — using ibrahim@ meanwhile).
// TODO(Ibrahim): confirm solutions@wstartech.ng is live and monitored, then swap this.
export const contactEmails = {
    general: "wstar5552@gmail.com",
    aiSolutions: "ibrahim@wstartech.ng",
};
