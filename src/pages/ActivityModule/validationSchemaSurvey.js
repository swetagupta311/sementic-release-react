import * as Yup from 'yup';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

export const validationSchemaSurvey = Yup.object().shape({
  // outlet_id: Yup.array().of(Yup.string()).min(1, "At least one outlet must be selected"),
  outlet_id: Yup.array().of(Yup.string()),
  city_id: Yup.string(),
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
