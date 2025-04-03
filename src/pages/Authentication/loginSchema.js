import * as Yup from "yup";

export const requestCodeSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
});

export const submitCodeSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  code: Yup.string()
    .matches(/^\d{6}$/, "Code must be exactly 6 digits")
    .required("Verification code is required"),
});
