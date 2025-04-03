import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import { useFormik } from 'formik';
import { validationSchema } from './validationSchema';
import { ToastContainer, toast } from 'react-toastify';
import CanvasDraw from 'react-canvas-draw';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import api from '../../api/apiService.js';
import { FaUndoAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const AddSurveyData = () => {
  useEffect(() => {
    // Init flatpickr
    flatpickr('.form-datepicker', {
      mode: 'single',
      static: true,
      monthSelectorType: 'static',
      dateFormat: 'M j, Y',
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    });
  }, []);

  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [storeRoles, setRoles] = useState();
  const [value, setValue] = useState(2);
  const [brandData, setBrandData] = useState([]);
  const [variantData, setVariantData] = useState([]);
  const [variantData2, setVariantData2] = useState([]);
  const [brandCount, setBrandCount] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [fwpData, setFwpData] = useState([]);
  const initialValues = {
    activityname: '',
    age: '',
    doYouSmoke: '',
    participateInSurvey: '',
    consent: false,
    name: '',
    gender: '',
    signature: '',
    cigaretteBrand: '',
    customBrand: '',
    cigaretteVariant: '',
    customVariant: '',
    ratingproduct: '',
    ratingpack: '',
    ratingstick: '',
    other1: '',
    other2: '',
    stickCount: '',
  };

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
      AddSurveydata(values);
      // AddEmployee(values);
    },
  });
  const canvasRef = useRef(null);

  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  const undoCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };
  //getting the roles
  useEffect(() => {
    getBrands();
    getActivity();
  }, []);

  const getActivity = async () => {
    try {
      const response = await api.get('/getactivities');
      if (response.status === 200) {
        setActivityData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  //for calling getVariant function
  const handleBrandChange = (e) => {
    setFieldValue('cigaretteBrand', e.target.value);
    getVariantName2(e.target.value);
  };
  const handleBrandChange2 = (e) => {
    setFieldValue('customBrand', e.target.value);
    getVariantName(e.target.value);
  };

  //post API for adding employee
  const AddSurveydata = async (values) => {
    setLoading(true);
    const loadingToast = toast.loading('Adding Employee...', {
      theme: 'colored',
      closeOnClick: true,
    });

    try {
      const formData = new FormData();
      if (canvasRef.current) {
        const signatureData = canvasRef.current.getDataURL(); // Get Base64 Image
        const blob = await fetch(signatureData).then((res) => res.blob()); // Convert to Blob
        formData.append('signature', blob, 'signature.png'); // Append to FormData
      }
      formData.append('activity_id', values.activityname);
      formData.append('user_id', values.fwp);
      formData.append('age', values.age);
      formData.append('do_you_smoke', values.doYouSmoke);
      formData.append('participate_survey', values.participateInSurvey);
      formData.append('name', values.name);
      formData.append('gender', values.gender);
      formData.append('brand_id', values.cigaretteBrand);
      formData.append('competitor_brand_id', values.customBrand);
      formData.append('competitor_variant_id', values.customVariant);
      formData.append('variant_id', values.cigaretteVariant);
      formData.append('other', values.other1);
      formData.append('competitor_other', values.other2);
      formData.append('product_rating', values.ratingproduct);
      formData.append('pack_rating', values.ratingpack);
      formData.append('stick_rating', values.ratingstick);

      const response = await api.post('/create-survey', formData);

      if (response.status === 201) {
        resetForm();
        setLoading(false);
        toast.update(loadingToast, {
          render: 'Survey added successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          theme: 'colored',
          closeOnClick: true,
        });
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

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //API for getting brands name
  const getBrands = async () => {
    try {
      const response = await api.get('/getbrands');
      if (response.status === 200) {
        setBrandData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //API for getting variant name from brands
  const getVariantName = async (id) => {
    try {
      const response = await api.get(`getBrandsVariants/${id}`);
      if (response.status === 200) {
        console.log(response.data);

        setVariantData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getVariantName2 = async (id) => {
    try {
      const response = await api.get(`getBrandsVariants/${id}`);
      if (response.status === 200) {
        setVariantData2(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleVariantChange = (e) => {
    const selectedVariantId = e.target.value;

    // Find the selected variant from variantData.variants
    const selectedVariant = variantData?.variants?.find(
      (variant) => variant.id === Number(selectedVariantId),
    );
    console.log(selectedVariant);

    if (selectedVariant) {
      setFieldValue('customVariant', selectedVariant.id);
      setBrandCount(selectedVariant.packSize);
    }
  };
  const [selectedFWP, setSelectedFWP] = useState(null);

  const handleActivityChange = (e) => {
    const selectedActivityId = e.target.value;
    const selectedActivity = activityData.find(
      (activity) => activity.id === Number(selectedActivityId),
    );

    if (selectedActivity) {
      // Store both FWP1 and FWP2
      setSelectedFWP({
        fwpOne: selectedActivity.fwpOne,
        fwpTwo: selectedActivity.fwpTwo,
      });
      console.log(selectedFWP);

      setFieldValue('activityname', selectedActivityId);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Add Survey Data" />
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <div className="text-[14px] rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add Survey Data
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Activity type
                    <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      name="activityname"
                      value={values.activityname}
                      onChange={handleActivityChange}
                      onBlur={handleBlur}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                        isOptionSelected ? 'text-black dark:text-white' : ''
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        Select activity name
                      </option>
                      {activityData
                        ? activityData.map((item, key) => (
                            <option
                              value={item.id}
                              className="text-body dark:text-bodydark"
                              key={key}
                            >
                              {item.activity_type}
                            </option>
                          ))
                        : null}
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
                    {touched.activityname && errors.activityname ? (
                      <p className="errormsg">{errors.activityname}</p>
                    ) : null}
                  </div>
                </div>
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Select FWP
                    <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      name="fwp"
                      value={values.fwp}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                        isOptionSelected ? 'text-black dark:text-white' : ''
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        defaultChecked
                        className="text-body dark:text-bodydark"
                      >
                        Select FWP
                      </option>
                      <option
                        value={selectedFWP?.fwpOne.id}
                        className="text-body dark:text-bodydark"
                      >
                        {selectedFWP?.fwpOne.firstname}{' '}
                        {selectedFWP?.fwpOne.lastname}
                      </option>
                      <option
                        value={selectedFWP?.fwpTwo.id}
                        className="text-body dark:text-bodydark"
                      >
                        {selectedFWP?.fwpTwo.firstname}{' '}
                        {selectedFWP?.fwpTwo.lastname}
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
                    {touched.fwp && errors.fwp ? (
                      <p className="errormsg">{errors.fwp}</p>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Age <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="age"
                    value={values.age}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="number"
                    placeholder="Enter your age"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.age && errors.age ? (
                    <p className="errormsg">{errors.age}</p>
                  ) : null}
                </div>
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Do you smoke? <span className="text-meta-1">*</span>
                  </label>

                  <div className="flex items-center space-x-4  mt-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="doYouSmoke"
                        value="1"
                        checked={values.doYouSmoke === '1'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="hidden"
                      />
                      <span className="w-5 h-5 inline-block border-2 border-gray-400 rounded-full flex items-center justify-center">
                        {values.doYouSmoke === '1' && (
                          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                        )}
                      </span>
                      <span>Yes</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="doYouSmoke"
                        value="0"
                        checked={values.doYouSmoke === '0'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="hidden"
                      />
                      <span className="w-5 h-5 inline-block border-2 border-gray-400 rounded-full flex items-center justify-center">
                        {values.doYouSmoke === '0' && (
                          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                        )}
                      </span>
                      <span>No</span>
                    </label>
                  </div>
                  {touched.doYouSmoke && errors.doYouSmoke ? (
                    <p className="errormsg">{errors.doYouSmoke}</p>
                  ) : null}
                </div>
                {values.doYouSmoke === '1' && (
                  <div className="w-full lg:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Would you like to participate in survey?{' '}
                      <span className="text-meta-1">*</span>
                    </label>
                    <div>
                      <div className="flex items-center space-x-4 mt-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="participateInSurvey"
                            value="1"
                            checked={values.participateInSurvey === '1'}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="hidden"
                          />
                          <span className="w-5 h-5 inline-block border-2 border-gray-400 rounded-full flex items-center justify-center">
                            {values.participateInSurvey === '1' && (
                              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            )}
                          </span>
                          <span>Yes</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="participateInSurvey"
                            value="0"
                            checked={values.participateInSurvey === '0'}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="hidden"
                          />
                          <span className="w-5 h-5 inline-block border-2 border-gray-400 rounded-full flex items-center justify-center">
                            {values.participateInSurvey === '0' && (
                              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            )}
                          </span>
                          <span>No</span>
                        </label>
                      </div>
                    </div>
                    {touched.participateInSurvey &&
                    errors.participateInSurvey ? (
                      <p className="errormsg">{errors.participateInSurvey}</p>
                    ) : null}
                  </div>
                )}
                {values.doYouSmoke === '1' &&
                  values.participateInSurvey === '1' && (
                    <div className="w-full lg:w-1/2 flex items-center">
                      <label className="mb-2.5 block text-black dark:text-white flex items-center">
                        <input
                          type="checkbox"
                          name="consent"
                          checked={values.consent}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="mr-2 h-5 w-5 rounded border-[1.5px] border-stroke bg-transparent text-primary outline-none transition focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:ring-primary"
                        />
                        I hereby confirm that I am 18 years old{' '}
                        <span className="text-meta-1">*</span>
                      </label>
                      {touched.consent && errors.consent ? (
                        <p className="errormsg">{errors.consent}</p>
                      ) : null}
                    </div>
                  )}
              </div>
              {values.doYouSmoke === '1' &&
                values.participateInSurvey === '1' && (
                  <>
                    {' '}
                    <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                      {values.consent === true && (
                        <>
                          <div className="w-full lg:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Name <span className="text-meta-1">*</span>
                            </label>
                            <input
                              onInput={(e) =>
                                (e.target.value = e.target.value.replace(
                                  /[0-9]/g,
                                  '',
                                ))
                              }
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="text"
                              placeholder="Enter your name"
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {touched.name && errors.name ? (
                              <p className="errormsg">{errors.name}</p>
                            ) : null}
                          </div>
                          <div className="w-full lg:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Gender <span className="text-meta-1">*</span>
                            </label>
                            <div className="relative z-20 bg-transparent dark:bg-form-input">
                              <select
                                name="gender"
                                value={values.gender}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                                  isOptionSelected
                                    ? 'text-black dark:text-white'
                                    : ''
                                }`}
                              >
                                <option
                                  value=""
                                  disabled
                                  defaultChecked
                                  className="text-body dark:text-bodydark"
                                >
                                  Select your gender
                                </option>
                                <option
                                  value="female"
                                  className="text-body dark:text-bodydark"
                                >
                                  Female
                                </option>
                                <option
                                  value="male"
                                  className="text-body dark:text-bodydark"
                                >
                                  Male
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
                              {touched.gender && errors.gender ? (
                                <p className="errormsg">{errors.gender}</p>
                              ) : null}
                            </div>
                          </div>
                          <div className="lg:w-1/2 ">
                            <div className="flex gap-2">
                              <div className="flex items-center">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Signature{' '}
                                  <span className="text-meta-1">*</span>
                                </label>{' '}
                                <div className="flex">
                                  {' '}
                                  <button
                                    type="button"
                                    onClick={undoCanvas}
                                    className="px-4 py-2 rounded flex gap-2 items-center"
                                  >
                                    <MdDelete /> Undo
                                  </button>
                                  <button
                                    type="button"
                                    onClick={clearCanvas}
                                    className="px-4 py-2 rounded flex gap-2 items-center"
                                  >
                                    {' '}
                                    <FaUndoAlt /> Clear
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="">
                              <CanvasDraw
                                className="!h-[45px] !w-[350px] border border-gray-300 rounded"
                                ref={canvasRef}
                                brushRadius={0.5}
                                lazyRadius={2}
                                brushColor="black"
                                canvasWidth={400}
                                canvasHeight={300}
                              />
                            </div>
                            {touched.signature && errors.signature ? (
                              <p className="errormsg">{errors.signature}</p>
                            ) : null}
                          </div>
                        </>
                      )}
                    </div>
                    {values.consent === true && (
                      <>
                        {' '}
                        <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                          <div className="w-full lg:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Which brand of cigarette do you currently buy to
                              smoke most often?{' '}
                              <span className="text-meta-1">*</span>
                            </label>
                            <div className="relative z-20 bg-transparent dark:bg-form-input">
                              <select
                                name="cigaretteBrand"
                                value={values.cigaretteBrand}
                                onChange={handleBrandChange}
                                onBlur={handleBlur}
                                className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
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
                                  Select your Cigarette Brand
                                </option>
                                {brandData
                                  ? brandData.map((item, key) => (
                                      <option
                                        value={item.id}
                                        className="text-body dark:text-bodydark"
                                        key={key}
                                      >
                                        {item.brand_name}
                                      </option>
                                    ))
                                  : null}
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
                              {touched.cigaretteBrand &&
                              errors.cigaretteBrand ? (
                                <p className="errormsg">
                                  {errors.cigaretteBrand}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="w-full lg:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Variant<span className="text-meta-1">*</span>
                            </label>
                            <div className="relative z-20 bg-transparent dark:bg-form-input">
                              <select
                                name="cigaretteVariant"
                                value={values.cigaretteVariant}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
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
                                  Select Variant
                                </option>
                                {variantData2?.variants?.map((item, key) => (
                                  <option
                                    value={item.id}
                                    className="text-body dark:text-bodydark"
                                    key={key}
                                  >
                                    {item.variant_name}
                                  </option>
                                ))}
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
                              {touched.cigaretteVariant &&
                              errors.cigaretteVariant ? (
                                <p className="errormsg">
                                  {errors.cigaretteVariant}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          {values.cigaretteBrand === '21' && (
                            <div className="w-full lg:w-1/2">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Others Please Specify{' '}
                                <span className="text-meta-1">*</span>
                              </label>
                              <input
                                onInput={(e) =>
                                  (e.target.value = e.target.value.replace(
                                    /[0-9]/g,
                                    '',
                                  ))
                                }
                                name="other1"
                                value={values.other1}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="Other"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              />
                              {touched.other1 && errors.other1 ? (
                                <p className="errormsg">{errors.other1}</p>
                              ) : null}
                            </div>
                          )}
                        </div>
                        <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                          <div className="w-full lg:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Given choice, would you like to change your
                              current brand to any other brand?{' '}
                              <span className="text-meta-1">*</span>
                            </label>
                            <div className="relative z-20 bg-transparent dark:bg-form-input">
                              <select
                                name="customBrand"
                                value={values.customBrand}
                                onChange={handleBrandChange2}
                                onBlur={handleBlur}
                                defaultValue={46}
                                className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
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
                                  Select your Cigarette Brand
                                </option>
                                {brandData
                                  ? brandData.map((item, key) => (
                                      <option
                                        value={item.id}
                                        className="text-body dark:text-bodydark"
                                        key={key}
                                        defaultChecked={item.id===46}
                                      >
                                        {item.brand_name}
                                      </option>
                                    ))
                                  : null}
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
                              {touched.customBrand && errors.customBrand ? (
                                <p className="errormsg">{errors.customBrand}</p>
                              ) : null}
                            </div>
                          </div>

                          <div className="w-full lg:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Variant<span className="text-meta-1">*</span>
                            </label>
                            <div className="relative z-20 bg-transparent dark:bg-form-input">
                              <select
                                name="customVariant"
                                value={values.customVariant}
                                onChange={handleVariantChange}
                                onBlur={handleBlur}
                                className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
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
                                  Select Variant
                                </option>
                                {variantData?.variants?.map((item, key) => (
                                  <option
                                    value={item.id}
                                    className="text-body dark:text-bodydark"
                                    key={item[key]}
                                  >
                                    {item.variant_name}
                                  </option>
                                ))}
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
                              {touched.customVariant && errors.customVariant ? (
                                <p className="errormsg">
                                  {errors.customVariant}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          {values.customBrand == 21 && (
                            <div className="w-full lg:w-1/2">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Others Please Specify{' '}
                                <span className="text-meta-1">*</span>
                              </label>
                              <input
                                onInput={(e) =>
                                  (e.target.value = e.target.value.replace(
                                    /[0-9]/g,
                                    '',
                                  ))
                                }
                                name="other2"
                                value={values.other2}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="Other"
                                className="mt-5 w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              />
                              {touched.other2 && errors.other2 ? (
                                <p className="errormsg">{errors.other2}</p>
                              ) : null}
                            </div>
                          )}
                          {values.customBrand == 46 &&
                            Array.isArray(brandCount) &&
                            brandCount.length > 0 && (
                              <div className="w-full lg:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Stick Count{' '}
                                  <span className="text-meta-1">*</span>
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                  <select
                                    name="stickCount"
                                    value={values.stickCount}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
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
                                      Stick Count
                                    </option>
                                    {brandCount?.map((item, id) => (
                                      <option
                                        key={id}
                                        value={item}
                                        className="text-body dark:text-bodydark"
                                      >
                                        {item}
                                      </option>
                                    ))}
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
                                  {touched.gender && errors.gender ? (
                                    <p className="errormsg">{errors.gender}</p>
                                  ) : null}
                                </div>
                              </div>
                            )}
                        </div>
                        <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                          <div className="w-full lg:w-1/2">
                            <Box sx={{ '& > legend': { mt: 2 } }}>
                              <Typography component="legend">
                                Please rate for product
                              </Typography>
                              <Rating
                                name="ratingproduct"
                                value={values.ratingproduct}
                                onChange={handleChange}
                                max={3}
                              />
                            </Box>
                            {touched.ratingproduct && errors.ratingproduct ? (
                              <p className="errormsg">{errors.ratingproduct}</p>
                            ) : null}
                          </div>
                          <div className="w-full lg:w-1/2">
                            <Box sx={{ '& > legend': { mt: 2 } }}>
                              <Typography component="legend">
                                Please rate for pack
                              </Typography>
                              <Rating
                                name="ratingpack"
                                value={values.ratingpack}
                                onChange={handleChange}
                                max={3}
                              />
                            </Box>
                            {touched.ratingpack && errors.ratingpack ? (
                              <p className="errormsg">{errors.ratingpack}</p>
                            ) : null}
                          </div>
                          <div className="w-full lg:w-1/2">
                            <Box sx={{ '& > legend': { mt: 2 } }}>
                              <Typography component="legend">
                                Please rate for stick
                              </Typography>
                              <Rating
                                name="ratingstick"
                                value={values.ratingstick}
                                onChange={handleChange}
                                max={3}
                              />
                            </Box>
                            {touched.ratingstick && errors.ratingstick ? (
                              <p className="errormsg">{errors.ratingstick}</p>
                            ) : null}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

              <button
                type="submit"
                disabled={loading}
                className="flex  justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default AddSurveyData;
