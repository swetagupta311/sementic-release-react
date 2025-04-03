import * as Yup from "yup";

export const validationSchemaoutlet = Yup.object().shape({
  name: Yup.string().required("Outlet is required"),
  latitude: Yup.string().when("testingoutlet", {
    is: (val) => val === true,
    then: (schema) => schema.required("Latitude is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  longitude: Yup.string().when("testingoutlet", {
    is: (val) => val === true, 
    then: (schema) => schema.required("Longitude is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  City: Yup.string(),
  outlet_address: Yup.string().required("Outlet address is required"),
  outlet_area: Yup.string().required("Outlet area is required"),
  outlet_code: Yup.string().required("Outlet code is required"),
  testingoutlet: Yup.boolean().required("Select yes or no"),
});
