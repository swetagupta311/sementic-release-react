import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  activityname: Yup.string().required('Please select activity'),
  fwp: Yup.string().required('Select FWP'),
  age: Yup.number()
    .required('Age is required')
    .min(18, 'You must be at least 18 years old'),

  doYouSmoke: Yup.string().required('Please select if you smoke'),

  participateInSurvey: Yup.string().when('doYouSmoke', {
    is: 'Yes',
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  consent: Yup.boolean().when('participateInSurvey', {
    is: 'Yes',
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  name: Yup.string().when('consent', {
    is: true,
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  gender: Yup.string().when('consent', {
    is: true,
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  signature: Yup.string().when("participateInSurvey", {
    is: true,
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  cigaretteBrand: Yup.string().when('consent', {
    is: true,
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  customBrand: Yup.string().when('consent', {
    is: true,
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  cigaretteVariant: Yup.string().when('consent', {
    is: true,
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  customVariant: Yup.string().when('consent', {
    is: true,
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  stickCount: Yup.string().when('customBrand', {
    is: 'malboro',
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  other1: Yup.string().when('cigaretteBrand', {
    is: 'Other',
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  other2: Yup.string().when('customBrand', {
    is: 'Other',
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  ratingproduct: Yup.number().when('consent', {
    is: true,
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  ratingpack: Yup.number().when('consent', {
    is: true,
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  ratingstick: Yup.number().when('consent', {
    is: true,
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default validationSchema;
