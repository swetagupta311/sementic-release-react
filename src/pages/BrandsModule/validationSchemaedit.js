import * as Yup from 'yup';

export const validationSchemaedit = Yup.object().shape({
  brandname: Yup.string().required('Brand name is required'),
  variation: Yup.array()
  .min(1, "At least one variation is required")
  .required("Variation is required"),
});
