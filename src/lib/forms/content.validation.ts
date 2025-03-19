import * as yup from 'yup';

export const contentSchema = yup.object().shape({
    title: yup.string().required("Content title is required"),
    parentID: yup.string().required(),
    intent: yup.string().required(),
    isActive: yup.bool(),
    activeOn: yup.date().optional(),
    expiresOn: yup.date().optional()
});