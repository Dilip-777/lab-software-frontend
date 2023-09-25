import axios from "axios";


export const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
});

export const getDepartments = async () => {
    try {   
        const response = await api.get("/department/getDepartments");
        return response.data.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getDepartment = async (id: number | string) => {
    try {
        const response = await api.get(`/department/getDepartment/${id}`);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export const getTests = async () => {
    try {   
        const response = await api.get("/test/getTests");
        return response.data.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getTest = async (id: number | string) => {
    try {   
        const response = await api.get(`/test/getTest/${id}`);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export const getProfiles = async () => {
    try {   
        const response = await api.get("/profile/getProfiles");
        return response.data.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getProfile = async (id: number | string) => {
    try {   
        const response = await api.get(`/profile/getProfile/${id}`);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return { profile: undefined, tests: [], references: [] };
    }
}


export const getPackages = async () => {
    try {   
        const response = await api.get("/package/getPackages");
        return response.data.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getPackage = async (id: number | string) => {
    try {   
        const response = await api.get(`/package/getPackage/${id}`);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export const getPriceLists = async (type: string) => {
    try {   
        const response = await api.get("/pricelist/getPricelist?type=" + type);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return { tests: [], headers: [] };
    }
}

export const getRefLabs = async () => {
    try {   
        const response = await api.get("/reflab/getRefLabs");
        return response.data.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getRefLab = async (id: number | string) => {
    try {   
        const response = await api.get(`/reflab/getRefLab/${id}`);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export const getRefDoctors = async () => {
    try {   
        const response = await api.get("/refdoctor/getRefDoctors");
        return response.data.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
