import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useState, useEffect } from 'react';

import { useFormik } from 'formik';
import { validationSchema } from './validationSchema';
import { ToastContainer, toast } from 'react-toastify';
import api from '../../api/apiService.js';
const AddActivity = () => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [outletData, setOutletData] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [fwp1, setFwp1] = useState([]);
  const [fwp2, setFwp2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityData, setCityData] = useState([]);
  const initialValues = {
    outletname: '',
    type: '',
    startdate: '',
    enddate: '',
    supervisor: '',
    fwp1: '',
    fwp2: '',
    city: '',
    starttime: '',
    endtime: '',
    day: '',
    other: '',
  };
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    resetForm,
    touched,
  } = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: (values) => {
      AddActivity(values);
      console.log(values);
    },
  });
  useEffect(() => {
    ViewCity();
    fetchUsers();
  }, []);
  //calling api to get fwp,supervisior
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Call API three times
      const [supervisorRes, fwp1Res, fwp2Res] = await Promise.all([
        api.get(`/getUsers?role=supervisor`),
        api.get(`/getUsers?role=fwp`),
        api.get(`/getUsers?role=fwp1`),
      ]);

      setSupervisors(supervisorRes.data);
      setFwp1(fwp1Res.data);
      setFwp2(fwp2Res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e) => {
    setFieldValue('city', e.target.value);
    OutletByCity(e.target.value);
  };
  const OutletByCity = async (e) => {
    try {
      const response = await api.get('/getoutlets', {
        params: {
          city_id: e,
        },
      });
      if (response.status === 200) {
        setOutletData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  //post API for adding employee
  const AddActivity = async (values) => {
    setLoading(true);
    const loadingToast = toast.loading('Adding Activity...', {
      theme: 'colored',
      closeOnClick: true,
    });

    try {
      let activityname=""
      if(values.type==="other"){
        activityname=values.other

      }
      else{
        activityname=values.type
      }
      console.log(activityname);
      
      const response = await api.post('/addactivity', {
        activity_type: activityname,
        outlet_id: Number(values.outletname),
        start_date: values.startdate,
        end_date: values.enddate,
        start_time: values.starttime,
        end_time: values.endtime,
        supervisor_id: values.supervisor,
        fwp1_id: values.fwp1,
        fwp2_id: values.fwp2,
        city_id: values.city,
        activity_day: values.day,
      });
      if (response.status === 201) {
        setLoading(false);
        toast.update(loadingToast, {
          render: 'Activity added successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          theme: 'colored',
          closeOnClick: true,
        });

        // Reset form and loading state AFTER toast update
        resetForm();
      }
    } catch (err) {
      console.error(err);

      toast.update(loadingToast, {
        render:
          err.response?.data?.error ||
          (Array.isArray(err.response?.data?.errors)
            ? err.response.data.errors[0]?.msg
            : 'Something went wrong'),
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        theme: 'colored',
        closeOnClick: true,
      });

      setLoading(false);
    }
  };
  //get API for listing city in dropdown
  const ViewCity = async () => {
    try {
      const response = await api.get('/getcities');
      if (response.status === 200) {
        setCityData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //for fetching day using start date
  const handleStartDateChange = (e) => {
    const { value } = e.target;
    setFieldValue('startdate', value);

    // Convert date string to day of the week
    if (value) {
      const date = new Date(value);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      setFieldValue('day', dayName);
    } else {
      setFieldValue('day', '');
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Add Activity" />
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add Activity
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    City Name <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      name="city"
                      value={values.city}
                      onChange={handleCityChange}
                      onBlur={handleBlur}
                      //   value={selectedOption}
                      //   onChange={(e) => {
                      //     setSelectedOption(e.target.value);
                      //     changeTextColor();
                      //   }}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                        isOptionSelected ? 'text-black dark:text-white' : ''
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        {' '}
                        Select your city
                      </option>

                      {cityData ? (
                        cityData.map((item, index) => (
                          <option
                            key={index}
                            value={item.id}
                            className="text-body dark:text-bodydark"
                          >
                            {item.city_name}
                          </option>
                        ))
                      ) : (
                        <option
                          value=""
                          disabled
                          className="text-body dark:text-bodydark"
                        >
                          {' '}
                          No City{' '}
                        </option>
                      )}
                    </select>

                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                    {touched.city && errors.city ? (
                      <p className="errormsg">{errors.city}</p>
                    ) : null}
                  </div>
                </div>
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Outlet <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      name="outletname"
                      value={values.outletname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                        isOptionSelected ? 'text-black dark:text-white' : ''
                      }`}
                      disabled={!outletData || outletData.length === 0} // Disable if no data
                    >
                      {outletData && outletData.length > 0 ? (
                        <>
                          <option
                            value=""
                            disabled
                            className="text-body dark:text-bodydark"
                          >
                            Select your outletname
                          </option>
                          {outletData.map((item, index) => (
                            <option
                              key={index}
                              value={item.id}
                              className="text-body dark:text-bodydark"
                            >
                              {item.outlet_name}
                            </option>
                          ))}
                        </>
                      ) : (
                        <option
                          value=""
                          disabled
                          className="text-body dark:text-bodydark"
                        >
                          No Outlet
                        </option>
                      )}
                    </select>

                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                    {touched.outletname && errors.outletname ? (
                      <p className="errormsg">{errors.outletname}</p>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Activity Start Date <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="date"
                    name="startdate"
                    value={values.startdate}
                    onChange={handleStartDateChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.startdate && errors.startdate ? (
                    <p className="errormsg">{errors.startdate}</p>
                  ) : null}
                </div>
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Activity End Date <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="date"
                    name="enddate"
                    value={values.enddate}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.enddate && errors.enddate ? (
                    <p className="errormsg">{errors.enddate}</p>
                  ) : null}
                </div>
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Activity Day <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="day"
                    value={values.day}
                    onChange={handleChange}
                    disabled
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.day && errors.day ? (
                    <p className="errormsg">{errors.day}</p>
                  ) : null}
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Activity Start Time <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="time"
                    name="starttime"
                    value={values.starttime}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.starttime && errors.starttime ? (
                    <p className="errormsg">{errors.starttime}</p>
                  ) : null}
                </div>
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Activity End Time <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="time"
                    name="endtime"
                    value={values.endtime}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.endtime && errors.endtime ? (
                    <p className="errormsg">{errors.endtime}</p>
                  ) : null}
                </div>
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Activity Type <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      name="type"
                      value={values.type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      //   value={selectedOption}
                      //   onChange={(e) => {
                      //     setSelectedOption(e.target.value);
                      //     changeTextColor();
                      //   }}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                        isOptionSelected ? 'text-black dark:text-white' : ''
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        Select Activity Name
                      </option>
                      <option
                        value="plugin"
                        className="text-body dark:text-bodydark"
                      >
                        Plugin
                      </option>
                      <option
                        value="lamp"
                        className="text-body dark:text-bodydark"
                      >
                        LAMP - Night Activitation
                      </option>
                      <option
                        value="other"
                        className="text-body dark:text-bodydark"
                      >
                        Other
                      </option>
                    </select>
                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                    {touched.type && errors.type ? (
                      <p className="errormsg">{errors.type}</p>
                    ) : null}
                  </div>
                </div>
                {values.type === 'other' && (
                  <div className="w-full lg:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Other <span className="text-meta-1">*</span>
                    </label>
                    <input
                      name="other"
                      value={values.other}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/[0-9]/g, ''))
                      }
                      type="text"
                      placeholder="Other"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {touched.other && errors.other ? (
                      <p className="errormsg">{errors.other}</p>
                    ) : null}
                 
                  </div>
                )}
              </div>
              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Supervisor <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      name="supervisor"
                      value={values.supervisor}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      //   value={selectedOption}
                      //   onChange={(e) => {
                      //     setSelectedOption(e.target.value);
                      //     changeTextColor();
                      //   }}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                        isOptionSelected ? 'text-black dark:text-white' : ''
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        Select Supervisior
                      </option>
                      {supervisors ? (
                        supervisors.map((item, index) => (
                          <option
                            key={index}
                            value={item.id}
                            className="text-body dark:text-bodydark"
                          >
                            {item.firstname} {item.lastname}
                          </option>
                        ))
                      ) : (
                        <option
                          value=""
                          disabled
                          className="text-body dark:text-bodydark"
                        >
                          {' '}
                          No Supervisior{' '}
                        </option>
                      )}
                    </select>

                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                    {touched.supervisor && errors.supervisor ? (
                      <p className="errormsg">{errors.supervisor}</p>
                    ) : null}
                  </div>
                </div>

                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    FWP1 <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      name="fwp1"
                      value={values.fwp1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      //   value={selectedOption}
                      //   onChange={(e) => {
                      //     setSelectedOption(e.target.value);
                      //     changeTextColor();
                      //   }}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                        isOptionSelected ? 'text-black dark:text-white' : ''
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        Select FWP
                      </option>
                      {fwp1 ? (
                        fwp1.map((item, index) => (
                          <option
                            key={index}
                            value={item.id}
                            className="text-body dark:text-bodydark"
                          >
                            {item.firstname} {item.lastname}
                          </option>
                        ))
                      ) : (
                        <option
                          value=""
                          disabled
                          className="text-body dark:text-bodydark"
                        >
                          {' '}
                          No FWP{' '}
                        </option>
                      )}
                    </select>

                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                    {touched.fwp1 && errors.fwp1 ? (
                      <p className="errormsg">{errors.fwp1}</p>
                    ) : null}
                  </div>
                </div>
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    fwp2 <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      name="fwp2"
                      value={values.fwp2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      //   value={selectedOption}
                      //   onChange={(e) => {
                      //     setSelectedOption(e.target.value);
                      //     changeTextColor();
                      //   }}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                        isOptionSelected ? 'text-black dark:text-white' : ''
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        Select FWP
                      </option>
                      {fwp1 ? (
                        fwp1.map((item, index) => (
                          <option
                            key={index}
                            value={item.id}
                            className="text-body dark:text-bodydark"
                          >
                            {item.firstname} {item.lastname}
                          </option>
                        ))
                      ) : (
                        <option
                          value=""
                          disabled
                          className="text-body dark:text-bodydark"
                        >
                          {' '}
                          No FWP{' '}
                        </option>
                      )}
                    </select>

                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                    {touched.fwp2 && errors.fwp2 ? (
                      <p className="errormsg">{errors.fwp2}</p>
                    ) : null}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="flex  justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Add Activity
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default AddActivity;
