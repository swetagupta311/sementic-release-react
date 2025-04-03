import * as Yup from "yup";

export const validationSchemaEditState = Yup.object().shape({
    state: Yup.string().required("State is required"),
   city :Yup.string().required("City is required"),
    brands: Yup.array()
    .min(1, "Select at least one brand")
    .required("Brand selection is required"),

});
