import React, { useState, useEffect } from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { MdEditSquare } from 'react-icons/md';
import { useFormik } from 'formik';
import api from '../../api/apiService.js';
import { validationSchemaActivityEdit } from './validationSchemaActivityEdit';
import { ToastContainer, toast } from 'react-toastify';

const EditActivity = (props) => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [loaderforfetching, setLoaderforfetching] = useState(false);
  const [loaderforupdating, setLoaderforupdating] = useState(false);
  const [activityId, setActivityid] = useState();
  const [supervisors, setSupervisors] = useState([]);
  const [fwp1, setFwp1] = useState([]);
  const [fwp2, setFwp2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [outletData, setOutletData] = useState([]);
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
  };
  const {
    resetForm,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
  } = useFormik({
    initialValues,
    validationSchema: validationSchemaActivityEdit,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
      EditActivity(values);
    },
  });
  const getRole=()=>{
    const role=localStorage.getItem("role");
  }
  useEffect(() => {
    getActivitybyId();
    ViewOutlet();
    ViewCity();
    fetchUsers();
  }, []);
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

  //get API for listing outlet in dropdown
  const ViewOutlet = async () => {
    try {
      const response = await api.get('/getoutlets');
      if (response.status === 200) {
        console.log(response);
        setOutletData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  //getting single activity
  const getActivitybyId = async () => {
    setLoaderforfetching(true);
    try {
      const response = await api.get(`/activityById/${props.activityId}`);

      if (response.status === 200) {
        
        setActivityid(response.data.id);
        setFieldValue('type', response.data.activity_type);
        setFieldValue('outletname', response.data.outlet_id);
        setFieldValue('startdate', response.data.start_date);
        setFieldValue('enddate', response.data.end_date);
        setFieldValue('starttime', response.data.start_time);
        setFieldValue('endtime', response.data.end_time);
        setFieldValue('supervisor', response.data.supervisor_id);
        setFieldValue('fwp1', response.data.fwp1_id);
        setFieldValue('fwp2', response.data.fwp2_id);
        setFieldValue('city', response.data.city_id);
        setFieldValue('activity_day', 'Monday');

      
        if (response.data.start_date) {
          const date = new Date(response.data.start_date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          setFieldValue('day', dayName);
        } else {
          setFieldValue('day', '');
        }
      }
    } catch (err) {
      console.error('Error fetching employee data:', err);
    } finally {
      setLoaderforfetching(false);
    }
  };
  //calling api to get fwp,supervisior
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const city = 'Noida';

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

  //put api to edit activity
  const EditActivity = async (values) => {
    setLoaderforupdating(true);
    const loadingToast = toast.loading('Updating Employee...', {
      theme: 'colored',
      closeOnClick: true,
    });

    try {
      const response = await api.put(`/editactivity/${activityId}`, {
        activity_type: values.type,
        outlet_id: values.outletname,
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

      if (response.status === 200) {
        props.setEditpopup(false);
        props.setToastActivity(!props.toaststatusActivity);
        resetForm();
        toast.update(loadingToast, {
          render: 'Activity updated successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          theme: 'colored',
          closeOnClick: true,
        });
        props.getActivity();
      }
    } catch (err) {
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
      console.log(err);
    } finally {
      setLoaderforupdating(false);
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
    <div
      className="relative z-999"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        aria-hidden="true"
      ></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform  rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[47rem]">
            <button
              className="float-right mr-4"
              onClick={() => props.setEditpopup(!props.editPopup)}
            >
              <ImCancelCircle className="h-12 w-[23px]" />
            </button>
            <div className="bg-white px-2 pt-3 pb-2 sm:p-4 sm:pb-2">
              <div className="sm:items-start">
                {loaderforfetching ? (
                  <div className="flex flex-col justify-center items-center h-full">
                    {' '}
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-14 h-12 text-[#3c50e0] animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      ></path>
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <p className="mt-4">Loading....</p>{' '}
                  </div>
                ) : (
                  <>
                    {' '}
                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10">
                      <MdEditSquare className="h-12 w-[23px]" />
                    </div>
                    <div className="mt-3  sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="font-semibold text-gray-900 text-2xl mt-4"
                        id="modal-title"
                      >
                        Edit Activity
                      </h3>
                      <div className="mt-2">
                        {' '}
                        <form onSubmit={handleSubmit}>
                          <div className="p-6.5">
                            <div className="mb-4.5 flex flex-col lg:flex-row gap-6">
                              <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Outlet Name{' '}
                                  <span className="text-meta-1">*</span>
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                  <select
                                  disabled
                                    name="outletname"
                                    value={values.outletname}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    //   value={selectedOption}
                                    //   onChange={(e) => {
                                    //     setSelectedOption(e.target.value);
                                    //     changeTextColor();
                                    //   }}
                                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                                      isOptionSelected
                                        ? 'text-black dark:text-white'
                                        : ''
                                    }`}
                                  >
                                    <option
                                      value=""
                                      disabled
                                      className="text-body dark:text-bodydark"
                                    >
                                      {' '}
                                      Select your outletname
                                    </option>

                                    {outletData ? (
                                      outletData.map((item, index) => (
                                        <option
                                          key={index}
                                          value={item.id}
                                          className="text-body dark:text-bodydark"
                                        >
                                          {item.outlet_name}
                                        </option>
                                      ))
                                    ) : (
                                      <option
                                        value=""
                                        disabled
                                        className="text-body dark:text-bodydark"
                                      >
                                        {' '}
                                        No Outlet{' '}
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
                                    <p className="errormsg">
                                      {errors.outletname}
                                    </p>
                                  ) : null}
                                </div>
                              </div>

                              <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  City Name{' '}
                                  <span className="text-meta-1">*</span>
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                  <select
                                  disabled
                                    name="city"
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    //   value={selectedOption}
                                    //   onChange={(e) => {
                                    //     setSelectedOption(e.target.value);
                                    //     changeTextColor();
                                    //   }}
                                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                                      isOptionSelected
                                        ? 'text-black dark:text-white'
                                        : ''
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
                            </div>
                            <div className="mb-4.5 flex flex-col lg:flex-row gap-6">
                              <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Activity Start Date{' '}
                                  <span className="text-meta-1">*</span>
                                </label>
                                <input
                                disabled
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
                              <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Activity End Date{' '}
                                  <span className="text-meta-1">*</span>
                                </label>
                                <input
                                disabled
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
                              <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Activity Day{' '}
                                  <span className="text-meta-1">*</span>
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
                            <div className="mb-4.5 flex flex-col lg:flex-row gap-6">
                              <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Activity Type{' '}
                                  <span className="text-meta-1">*</span>
                                </label>
                                <input
                                disabled
                                  name="type"
                                  value={values.type}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  onInput={(e) =>
                                    (e.target.value = e.target.value.replace(
                                      /[0-9]/g,
                                      '',
                                    ))
                                  }
                                  type="text"
                                  placeholder="Activity Type"
                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                {touched.type && errors.type ? (
                                  <p className="errormsg">{errors.type}</p>
                                ) : null}
                                <div></div>
                              </div>
                              <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Activity Start Time{' '}
                                  <span className="text-meta-1">*</span>
                                </label>
                                <input
                                  type="time"
                                  name="starttime"
                                  value={values.starttime}
                                  onChange={handleChange}
                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    disabled={localStorage.getItem("role")!=="superadmin"}                          
                                />
                                {touched.starttime && errors.starttime ? (
                                  <p className="errormsg">{errors.starttime}</p>
                                ) : null}
                              </div>
                              <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Activity End Time{' '}
                                  <span className="text-meta-1">*</span>
                                </label>
                                <input
                
                                  type="time"
                                  name="endtime"
                                  value={values.endtime}
                                  onChange={handleChange}
                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                  disabled={localStorage.getItem("role")!=="superadmin"}   
                               />
                                {touched.endtime && errors.endtime ? (
                                  <p className="errormsg">{errors.endtime}</p>
                                ) : null}
                              </div>
                            </div>
                            <div className="mb-4.5 flex flex-col lg:flex-row gap-6">
                              <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Supervisor{' '}
                                  <span className="text-meta-1">*</span>
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
                                      isOptionSelected
                                        ? 'text-black dark:text-white'
                                        : ''
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
                                    <p className="errormsg">
                                      {errors.supervisor}
                                    </p>
                                  ) : null}
                                </div>
                              </div>

                              <div className="w-full xl:w-1/2">
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
                                      isOptionSelected
                                        ? 'text-black dark:text-white'
                                        : ''
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
                              <div className="w-full xl:w-1/2">
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
                                      isOptionSelected
                                        ? 'text-black dark:text-white'
                                        : ''
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
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditActivity;
