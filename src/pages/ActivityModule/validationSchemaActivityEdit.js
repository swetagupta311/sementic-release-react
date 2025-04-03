import * as Yup from 'yup';
import dayjs from 'dayjs';

export const validationSchemaActivityEdit = Yup.object().shape({
  outletname: Yup.string().required('Outlet Name is required'),
  type: Yup.string().required('Activity is required'),
  startdate: Yup.string()
    .required('Choose Activity start date')
    .test('valid-date', 'Invalid date', (value) => {
      return value && dayjs(value, 'YYYY-MM-DD', true).isValid();
    }),
  enddate: Yup.string()
    .required('Choose Activity end date')
    .test('valid-date', 'Invalid date', (value) => {
      return value && dayjs(value, 'YYYY-MM-DD', true).isValid();
    }),
  starttime: Yup.string()
    .required('Choose Activity start time'),
    
  endtime: Yup.string()
    .required('Choose Activity end time')

   ,
  city: Yup.string().required('Enter city'),
  supervisor: Yup.string().required('Supervisor is required'),
  fwp1: Yup.string().required('FWP1 is required'),
  fwp2: Yup.string().required('FWP2 is required'),
  day:Yup.string().required()
});
