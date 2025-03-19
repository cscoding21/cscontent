import * as yup from 'yup';

export const folderSchema = yup.object().shape({
	name: yup.string().required("Folder name is required"),
	parentID: yup.string().nullable()
});