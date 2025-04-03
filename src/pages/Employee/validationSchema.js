import * as Yup from 'yup';
import dayjs from 'dayjs';

export const validationSchema = Yup.object().shape({
  firstname: Yup.string()
  .matches(/^[A-Za-z\s]+$/, 'Only letters are allowed')
  .required('First name is required')
,

  lastname: Yup.string()
  .matches(/^[A-Za-z\s]+$/, 'Only letters are allowed'),

  dob: Yup.string()
    .required('Choose date of birth')
    .test('valid-date', 'Invalid date', (value) => {
      return value && dayjs(value, 'YYYY-MM-DD', true).isValid();
    })
    .test('past-date', 'Future dates are not allowed', (value) => {
      return value && dayjs(value).isBefore(dayjs(), 'day'); // Restrict future dates
    }),

  email: Yup.string()
    .email('Invalid email format'),

  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),

  aadharphoto: Yup.mixed(),
  role: Yup.string().required('Role is required'),

  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  cfourvalidation: Yup.boolean().required('Select yes or no'),
  cfourphoto: Yup.mixed(),
});
