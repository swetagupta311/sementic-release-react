import * as Yup from 'yup';
import dayjs from 'dayjs';
export const validationSchema = Yup.object().shape({
   city_id: Yup.string().required("Select City"),
   employee_type:Yup.string().required("Select Employee type"),
   start_date: Yup.string()
    .test('valid-date', 'Invalid date', (value) => {
      return value && dayjs(value, 'YYYY-MM-DD', true).isValid();
    })
    .required('Start date is required'),
  
  end_date: Yup.string()
    .test('valid-date', 'Invalid date', (value) => {
      return value && dayjs(value, 'YYYY-MM-DD', true).isValid();
    })
    .test('is-greater-or-equal', 'End date must be same or after start date', function (value) {
      const { start_date } = this.parent;
      return start_date && value ? dayjs(value).isSameOrAfter(dayjs(start_date)) : true;
    })
    .required('End date is required'),

});
